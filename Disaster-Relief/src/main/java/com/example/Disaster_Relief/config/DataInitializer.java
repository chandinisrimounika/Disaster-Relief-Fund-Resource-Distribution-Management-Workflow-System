package com.example.Disaster_Relief.config;

import com.example.Disaster_Relief.enums.Role;
import com.example.Disaster_Relief.enums.UnitType;
import com.example.Disaster_Relief.model.ResourceItem;
import com.example.Disaster_Relief.model.User;
import com.example.Disaster_Relief.repository.ResourceItemRepository;
import com.example.Disaster_Relief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceItemRepository resourceItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            String password = "password123";
            userRepository.save(new User(null, "Admin User", "admin@relief.com", password, "1234567890", Role.ADMIN, null));
            userRepository.save(new User(null, "Donor User", "donor@test.com", password, "0987654321", Role.DONOR, null));
            userRepository.save(new User(null, "Coordinator User", "coord@relief.com", password, "1122334455", Role.RELIEF_COORDINATOR, null));
            userRepository.save(new User(null, "Officer User", "officer@relief.com", password, "5544332211", Role.FIELD_OFFICER, null));
        }

        if (resourceItemRepository.count() == 0) {
            resourceItemRepository.save(new ResourceItem(null, "Food Packet", UnitType.PACK, null));
            resourceItemRepository.save(new ResourceItem(null, "Water Bottle", UnitType.UNIT, null));
            resourceItemRepository.save(new ResourceItem(null, "Medicine Kit", UnitType.BOX, null));
            resourceItemRepository.save(new ResourceItem(null, "Blanket", UnitType.UNIT, null));
            resourceItemRepository.save(new ResourceItem(null, "Clothing", UnitType.PACK, null));
        }
    }
}
