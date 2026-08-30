package com.ecommerce.Service;

import com.ecommerce.DTO.AddressRequest;
import com.ecommerce.DTO.AddressResponse;
import com.ecommerce.Entity.Address;
import com.ecommerce.Entity.User;
import com.ecommerce.exception.InvalidStateException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedActionException;
import com.ecommerce.Repository.AddressRepository;
import com.ecommerce.Repository.OrderRepository;
import com.ecommerce.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AddressService(AddressRepository addressRepository,
                          UserRepository userRepository,
                          OrderRepository orderRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<AddressResponse> getMyAddresses(String email) {
        User user = getUser(email);
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AddressResponse addAddress(AddressRequest request, String email) {
        User user = getUser(email);

        Address address = new Address();
        address.setUser(user);
        applyRequest(address, request);

        if (request.isDefault()) {
            unsetExistingDefault(user.getId());
        }

        addressRepository.save(address);
        return toResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressRequest request, String email) {
        Address address = getOwnedAddress(addressId, email);
        assertNotUsedInOrder(addressId);

        applyRequest(address, request);

        if (request.isDefault()) {
            unsetExistingDefault(address.getUser().getId());
            address.setDefault(true);
        }

        addressRepository.save(address);
        return toResponse(address);
    }

    @Transactional
    public void deleteAddress(Long addressId, String email) {
        Address address = getOwnedAddress(addressId, email);
        assertNotUsedInOrder(addressId);
        addressRepository.delete(address);
    }

    private void applyRequest(Address address, AddressRequest request) {
        address.setLabel(request.getLabel());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setPhoneNumber(request.getPhoneNumber());
    }

    private void unsetExistingDefault(Long userId) {
        addressRepository.findByUserId(userId).forEach(a -> {
            if (a.isDefault()) {
                a.setDefault(false);
                addressRepository.save(a);
            }
        });
    }

    private void assertNotUsedInOrder(Long addressId) {
        if (orderRepository.existsByDeliveryAddressId(addressId)) {
            throw new InvalidStateException("Cannot modify an address that has already been used in an order");
        }
    }

    private Address getOwnedAddress(Long addressId, String email) {
        User user = getUser(email);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not own this address");
        }

        return address;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist"));
    }

    private AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLabel(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getPhoneNumber(),
                address.isDefault()
        );
    }
}