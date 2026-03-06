// C# Example - Demonstrates classes, LINQ, and async/await
// Use this file to validate C# extension support on VFS

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VirtualFileSystem.Examples
{
    /// <summary>
    /// Interface for entities with an ID
    /// </summary>
    public interface IEntity
    {
        int Id { get; }
    }

    /// <summary>
    /// Product entity
    /// </summary>
    public record Product(int Id, string Name, decimal Price, string Category) : IEntity;

    /// <summary>
    /// Generic repository interface
    /// </summary>
    public interface IRepository<T> where T : IEntity
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task DeleteAsync(int id);
    }

    /// <summary>
    /// In-memory product repository
    /// </summary>
    public class ProductRepository : IRepository<Product>
    {
        private readonly List<Product> _products = new();

        public Task<Product?> GetByIdAsync(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            return Task.FromResult(product);
        }

        public Task<IEnumerable<Product>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Product>>(_products.ToList());
        }

        public Task AddAsync(Product product)
        {
            _products.RemoveAll(p => p.Id == product.Id);
            _products.Add(product);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(int id)
        {
            _products.RemoveAll(p => p.Id == id);
            return Task.CompletedTask;
        }

        // LINQ query methods
        public IEnumerable<Product> GetByCategory(string category) =>
            _products.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));

        public IEnumerable<IGrouping<string, Product>> GroupByCategory() =>
            _products.GroupBy(p => p.Category);

        public decimal GetTotalValue() =>
            _products.Sum(p => p.Price);
    }

    /// <summary>
    /// Example program
    /// </summary>
    public class Example
    {
        public static async Task Main(string[] args)
        {
            var repository = new ProductRepository();

            // Add products
            await repository.AddAsync(new Product(1, "Laptop", 999.99m, "Electronics"));
            await repository.AddAsync(new Product(2, "Mouse", 29.99m, "Electronics"));
            await repository.AddAsync(new Product(3, "Desk", 299.99m, "Furniture"));
            await repository.AddAsync(new Product(4, "Chair", 199.99m, "Furniture"));

            // Display all products
            Console.WriteLine("All Products:");
            var products = await repository.GetAllAsync();
            foreach (var product in products)
            {
                Console.WriteLine($"  [{product.Id}] {product.Name} - ${product.Price} ({product.Category})");
            }

            // Group by category
            Console.WriteLine("\nGrouped by Category:");
            foreach (var group in repository.GroupByCategory())
            {
                Console.WriteLine($"  {group.Key}:");
                foreach (var product in group)
                {
                    Console.WriteLine($"    - {product.Name}: ${product.Price}");
                }
            }

            // Total value
            Console.WriteLine($"\nTotal Inventory Value: ${repository.GetTotalValue()}");
        }
    }
}
