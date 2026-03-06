// Kotlin Example - Demonstrates data classes, extensions, and coroutines
// Use this file to validate Kotlin extension support on VFS

package com.vfs.examples

import kotlinx.coroutines.*

// Data class with default values
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val roles: List<String> = emptyList()
)

// Sealed class for results
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Interface definition
interface Repository<T> {
    suspend fun findById(id: Int): T?
    suspend fun findAll(): List<T>
    suspend fun save(entity: T)
    suspend fun delete(id: Int)
}

// Class implementing interface
class UserRepository : Repository<User> {
    private val users = mutableMapOf<Int, User>()

    override suspend fun findById(id: Int): User? = users[id]

    override suspend fun findAll(): List<User> = users.values.toList()

    override suspend fun save(entity: User) {
        users[entity.id] = entity
    }

    override suspend fun delete(id: Int) {
        users.remove(id)
    }

    // Additional methods
    fun findByRole(role: String): List<User> =
        users.values.filter { role in it.roles }
}

// Extension functions
fun String.isValidEmail(): Boolean =
    this.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))

fun List<User>.admins(): List<User> =
    this.filter { "admin" in it.roles }

// Higher-order function
inline fun <T> measureTime(block: () -> T): Pair<T, Long> {
    val start = System.currentTimeMillis()
    val result = block()
    val elapsed = System.currentTimeMillis() - start
    return result to elapsed
}

// Object declaration (singleton)
object UserService {
    private val repository = UserRepository()

    suspend fun createUser(name: String, email: String): Result<User> {
        return if (email.isValidEmail()) {
            val user = User(
                id = (1..10000).random(),
                name = name,
                email = email,
                roles = listOf("user")
            )
            repository.save(user)
            Result.Success(user)
        } else {
            Result.Error("Invalid email format")
        }
    }

    suspend fun getAllUsers(): List<User> = repository.findAll()
}

// Main function with coroutines
fun main() = runBlocking {
    println("Creating users...")

    val result1 = UserService.createUser("Alice", "alice@example.com")
    val result2 = UserService.createUser("Bob", "bob@example.com")
    val result3 = UserService.createUser("Charlie", "invalid-email")

    listOf(result1, result2, result3).forEach { result ->
        when (result) {
            is Result.Success -> println("  Created: ${result.data}")
            is Result.Error -> println("  Error: ${result.message}")
            is Result.Loading -> println("  Loading...")
        }
    }

    println("\nAll users:")
    UserService.getAllUsers().forEach { user ->
        println("  [${user.id}] ${user.name} - ${user.email}")
    }

    // Using extension function
    val testEmail = "test@example.com"
    println("\nIs '$testEmail' valid? ${testEmail.isValidEmail()}")
}
