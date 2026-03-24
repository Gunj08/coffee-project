package com.coffeecafe.coffee.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private Double price;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String category;
    private Boolean available = true;

    @ManyToOne
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    // --- MULTIPLE IMAGES ---
    @ElementCollection
    @CollectionTable(name = "menu_item_photos", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "photo", columnDefinition = "LONGTEXT")
    private List<String> photos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Cafe getCafe() { return cafe; }
    public void setCafe(Cafe cafe) { this.cafe = cafe; }

    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }
}