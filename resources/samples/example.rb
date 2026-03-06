# Ruby Example - Demonstrates classes, modules, and blocks
# Use this file to validate Ruby extension support on VFS

# Module for shared behavior
module Printable
  def to_display
    "#{self.class.name}: #{to_s}"
  end
end

# Base class
class Animal
  include Printable
  
  attr_reader :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
  
  def speak
    raise NotImplementedError, "Subclass must implement speak"
  end
  
  def to_s
    "#{@name} (#{@age} years old)"
  end
end

# Derived class
class Dog < Animal
  attr_reader :breed
  
  def initialize(name, age, breed)
    super(name, age)
    @breed = breed
  end
  
  def speak
    "Woof!"
  end
  
  def to_s
    "#{super} - #{@breed}"
  end
end

# Derived class
class Cat < Animal
  def speak
    "Meow!"
  end
end

# Collection class with enumerable
class AnimalShelter
  include Enumerable
  
  def initialize
    @animals = []
  end
  
  def add(animal)
    @animals << animal
    self
  end
  
  def each(&block)
    @animals.each(&block)
  end
  
  def find_by_name(name)
    @animals.find { |a| a.name.downcase == name.downcase }
  end
  
  def dogs
    @animals.select { |a| a.is_a?(Dog) }
  end
  
  def cats
    @animals.select { |a| a.is_a?(Cat) }
  end
end

# Main execution
if __FILE__ == $0
  shelter = AnimalShelter.new
  
  shelter
    .add(Dog.new("Buddy", 3, "Golden Retriever"))
    .add(Dog.new("Max", 5, "German Shepherd"))
    .add(Cat.new("Whiskers", 2))
    .add(Cat.new("Luna", 4))
  
  puts "All animals:"
  shelter.each { |animal| puts "  #{animal.to_display}" }
  
  puts "\nDogs:"
  shelter.dogs.each { |dog| puts "  #{dog.name} says #{dog.speak}" }
  
  puts "\nCats:"
  shelter.cats.each { |cat| puts "  #{cat.name} says #{cat.speak}" }
  
  # Find by name
  found = shelter.find_by_name("buddy")
  puts "\nFound: #{found.to_display}" if found
end
