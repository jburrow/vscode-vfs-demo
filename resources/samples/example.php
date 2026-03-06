<?php
/**
 * PHP Example - Demonstrates classes, interfaces, and type hints
 * Use this file to validate PHP extension support on VFS
 */

declare(strict_types=1);

namespace VirtualFileSystem\Examples;

/**
 * Interface for JSON serializable objects
 */
interface JsonSerializable
{
    public function toJson(): string;
    public function toArray(): array;
}

/**
 * Abstract base class for entities
 */
abstract class Entity implements JsonSerializable
{
    protected int $id;
    protected \DateTime $createdAt;

    public function __construct(int $id)
    {
        $this->id = $id;
        $this->createdAt = new \DateTime();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_PRETTY_PRINT);
    }
}

/**
 * User entity class
 */
class User extends Entity
{
    private string $name;
    private string $email;
    private array $roles;

    public function __construct(int $id, string $name, string $email, array $roles = [])
    {
        parent::__construct($id);
        $this->name = $name;
        $this->email = $email;
        $this->roles = $roles;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles, true);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles,
            'createdAt' => $this->createdAt->format('Y-m-d H:i:s'),
        ];
    }
}

/**
 * User repository
 */
class UserRepository
{
    /** @var User[] */
    private array $users = [];

    public function save(User $user): void
    {
        $this->users[$user->getId()] = $user;
    }

    public function findById(int $id): ?User
    {
        return $this->users[$id] ?? null;
    }

    /**
     * @return User[]
     */
    public function findAll(): array
    {
        return array_values($this->users);
    }

    /**
     * @return User[]
     */
    public function findByRole(string $role): array
    {
        return array_filter($this->users, fn(User $u) => $u->hasRole($role));
    }
}

// Main execution
$repository = new UserRepository();

$repository->save(new User(1, 'Alice', 'alice@example.com', ['admin', 'user']));
$repository->save(new User(2, 'Bob', 'bob@example.com', ['user']));
$repository->save(new User(3, 'Charlie', 'charlie@example.com', ['user', 'moderator']));

echo "All Users:\n";
foreach ($repository->findAll() as $user) {
    echo "  [{$user->getId()}] {$user->getName()} - {$user->getEmail()}\n";
}

echo "\nAdmins:\n";
foreach ($repository->findByRole('admin') as $admin) {
    echo "  {$admin->getName()}\n";
}

echo "\nUser as JSON:\n";
$user = $repository->findById(1);
if ($user) {
    echo $user->toJson() . "\n";
}
