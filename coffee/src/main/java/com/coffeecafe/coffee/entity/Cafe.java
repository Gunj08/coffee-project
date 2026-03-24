package com.coffeecafe.coffee.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cafes")
public class Cafe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cafe_name")
    private String cafeName;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "opening_time")
    private String openingTime;

    @Column(name = "closing_time")
    private String closingTime;

    // Address fields
    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "pincode")
    private String pincode;

    // Business info
    @Column(name = "business_type")
    private String businessType;

    @Column(name = "fssai_license_number")
    private String fssaiLicenseNumber;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "account_holder_name")
    private String accountHolderName;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "district")
    private String district = "";

    @Column(name = "country")
    private String country = "";

    @Column(name = "pan_number")
    private String panNumber = "";

    // Service Features
    @Column(name = "has_home_delivery")
    private Boolean hasHomeDelivery = false;

    @Column(name = "has_takeaway")
    private Boolean hasTakeaway = false;

    @Column(name = "has_dine_in")
    private Boolean hasDineIn = false;

    // Media
    @ElementCollection
    @CollectionTable(name = "cafe_images", joinColumns = @JoinColumn(name = "cafe_id"))
    @Column(name = "image_data", columnDefinition = "LONGTEXT")
    private List<String> cafeImages = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCafeName() { return cafeName; }
    public void setCafeName(String cafeName) { this.cafeName = cafeName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOpeningTime() { return openingTime; }
    public void setOpeningTime(String openingTime) { this.openingTime = openingTime; }

    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public String getFssaiLicenseNumber() { return fssaiLicenseNumber; }
    public void setFssaiLicenseNumber(String fssaiLicenseNumber) { this.fssaiLicenseNumber = fssaiLicenseNumber; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public List<String> getCafeImages() { return cafeImages; }
    public void setCafeImages(List<String> cafeImages) { this.cafeImages = cafeImages; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public Boolean getHasHomeDelivery() { return hasHomeDelivery; }
    public void setHasHomeDelivery(Boolean hasHomeDelivery) { this.hasHomeDelivery = hasHomeDelivery; }

    public Boolean getHasTakeaway() { return hasTakeaway; }
    public void setHasTakeaway(Boolean hasTakeaway) { this.hasTakeaway = hasTakeaway; }

    public Boolean getHasDineIn() { return hasDineIn; }
    public void setHasDineIn(Boolean hasDineIn) { this.hasDineIn = hasDineIn; }
}