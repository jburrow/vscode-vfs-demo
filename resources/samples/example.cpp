// C++ Example - Demonstrates classes, templates, and STL
// Use this file to validate C++ extension support on VFS

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>

// Template class for a generic container
template<typename T>
class Container {
private:
    std::vector<T> items;

public:
    void add(const T& item) {
        items.push_back(item);
    }

    void remove(size_t index) {
        if (index < items.size()) {
            items.erase(items.begin() + index);
        }
    }

    T& get(size_t index) {
        return items.at(index);
    }

    size_t size() const {
        return items.size();
    }

    // Iterator support
    typename std::vector<T>::iterator begin() { return items.begin(); }
    typename std::vector<T>::iterator end() { return items.end(); }
};

// Base class with virtual methods
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};

// Derived class
class Circle : public Shape {
private:
    double radius;

public:
    explicit Circle(double r) : radius(r) {}

    double area() const override {
        return 3.14159265359 * radius * radius;
    }

    std::string name() const override {
        return "Circle";
    }
};

// Derived class
class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const override {
        return width * height;
    }

    std::string name() const override {
        return "Rectangle";
    }
};

int main() {
    // Using smart pointers
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));

    for (const auto& shape : shapes) {
        std::cout << shape->name() << " area: " << shape->area() << std::endl;
    }

    // Using template container
    Container<std::string> names;
    names.add("Alice");
    names.add("Bob");
    names.add("Charlie");

    std::cout << "Names in container:" << std::endl;
    for (const auto& name : names) {
        std::cout << "  " << name << std::endl;
    }

    return 0;
}
