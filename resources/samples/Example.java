// Java Example - Demonstrates classes, interfaces, and generics
// Use this file to validate Java extension support on VFS

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Interface for printable objects
 */
interface Printable {
    String toPrintableString();
}

/**
 * Generic repository interface
 */
interface Repository<T, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}

/**
 * User entity class
 */
public class Example implements Printable {
    private final int id;
    private String name;
    private String email;

    public Example(int id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Override
    public String toPrintableString() {
        return String.format("User[id=%d, name=%s, email=%s]", id, name, email);
    }

    @Override
    public String toString() {
        return toPrintableString();
    }
}

/**
 * In-memory user repository implementation
 */
class UserRepository implements Repository<Example, Integer> {
    private final List<Example> users = new ArrayList<>();

    @Override
    public void save(Example user) {
        users.removeIf(u -> u.getId() == user.getId());
        users.add(user);
    }

    @Override
    public Optional<Example> findById(Integer id) {
        return users.stream()
                .filter(u -> u.getId() == id)
                .findFirst();
    }

    @Override
    public List<Example> findAll() {
        return new ArrayList<>(users);
    }

    @Override
    public void deleteById(Integer id) {
        users.removeIf(u -> u.getId() == id);
    }

    public List<Example> findByNameContaining(String name) {
        return users.stream()
                .filter(u -> u.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }
}

/**
 * Main application class
 */
class Application {
    public static void main(String[] args) {
        UserRepository repository = new UserRepository();
        
        // Create users
        repository.save(new Example(1, "Alice Johnson", "alice@example.com"));
        repository.save(new Example(2, "Bob Smith", "bob@example.com"));
        repository.save(new Example(3, "Charlie Brown", "charlie@example.com"));
        
        // Print all users
        System.out.println("All users:");
        repository.findAll().forEach(u -> System.out.println("  " + u));
        
        // Find by ID
        repository.findById(2).ifPresent(u -> 
            System.out.println("\nFound by ID 2: " + u)
        );
        
        // Find by name
        System.out.println("\nUsers containing 'li':");
        repository.findByNameContaining("li").forEach(u -> 
            System.out.println("  " + u)
        );
    }
}
