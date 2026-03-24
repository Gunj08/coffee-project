package com.coffeecafe.coffee.controller;

import com.coffeecafe.coffee.entity.Cafe;
import com.coffeecafe.coffee.entity.TableEntity;
import com.coffeecafe.coffee.repository.CafeRepository;
import com.coffeecafe.coffee.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@CrossOrigin(origins = "http://localhost:5173")
public class CafeController {

    @Autowired
    private CafeRepository cafeRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerCafe(@RequestBody Cafe cafe) {
        try {
            cafe.setId(null);
            Cafe savedCafe = cafeRepository.save(cafe);
            return ResponseEntity.ok(savedCafe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // GET cafe by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCafeById(@PathVariable("id") Long id) {
        System.out.println("DEBUG: getCafeById called for ID: " + id);
        return cafeRepository.findById(id)
                .map(cafe -> {
                    System.out.println("DEBUG: Cafe found: " + cafe.getCafeName());
                    return ResponseEntity.ok(cafe);
                })
                .orElseGet(() -> {
                    System.out.println("DEBUG: Cafe NOT found for ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }


    // GET all cafes
    @GetMapping("/all")
    public List<Cafe> getAllCafes() {
        return cafeRepository.findAll();
    }

    // UPDATE cafe
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCafe(@PathVariable("id") Long id, @RequestBody Cafe cafeDetails) {

        return cafeRepository.findById(id).map(cafe -> {
            cafe.setCafeName(cafeDetails.getCafeName());
            cafe.setOwnerName(cafeDetails.getOwnerName());
            cafe.setCafeImages(cafeDetails.getCafeImages());
            cafe.setUpiId(cafeDetails.getUpiId());
            cafe.setAccountHolderName(cafeDetails.getAccountHolderName());
            cafe.setAccountNumber(cafeDetails.getAccountNumber());
            cafe.setIfscCode(cafeDetails.getIfscCode());
            cafe.setDistrict(cafeDetails.getDistrict());
            cafe.setCountry(cafeDetails.getCountry());
            cafe.setPanNumber(cafeDetails.getPanNumber());
            cafe.setHasHomeDelivery(cafeDetails.getHasHomeDelivery());
            cafe.setHasTakeaway(cafeDetails.getHasTakeaway());
            cafe.setHasDineIn(cafeDetails.getHasDineIn());
            return ResponseEntity.ok(cafeRepository.save(cafe));
        }).orElse(ResponseEntity.notFound().build());
    }



    @Autowired
    private TableRepository tableRepository;

    @GetMapping("/tables/{cafeId}")
    public List<TableEntity> getTablesByCafe(@PathVariable("cafeId") Long cafeId) {
        return tableRepository.findByCafeId(cafeId);
    }


    @GetMapping("/tables/all")
    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    @DeleteMapping("/tables/delete/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable("id") Long id) {
        tableRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/tables/add")
    public ResponseEntity<?> registerTable(@RequestBody TableEntity table) {
        try {
            table.setId(null);
            TableEntity savedTable = tableRepository.save(table);
            return ResponseEntity.ok(savedTable);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCafe(@PathVariable("id") Long id) {

        try {
            cafeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting cafe");
        }
    }


}