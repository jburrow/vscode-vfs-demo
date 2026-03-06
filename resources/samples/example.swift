// Swift Example - Demonstrates structs, protocols, and optionals
// Use this file to validate Swift extension support on VFS

import Foundation

// Protocol definition
protocol Describable {
    var description: String { get }
}

// Struct with protocol conformance
struct Point: Describable, Equatable {
    let x: Double
    let y: Double
    
    var description: String {
        return "(\(x), \(y))"
    }
    
    func distanceTo(_ other: Point) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        return sqrt(dx * dx + dy * dy)
    }
}

// Enum with associated values
enum Shape: Describable {
    case circle(center: Point, radius: Double)
    case rectangle(origin: Point, width: Double, height: Double)
    case triangle(p1: Point, p2: Point, p3: Point)
    
    var description: String {
        switch self {
        case .circle(let center, let radius):
            return "Circle at \(center.description) with radius \(radius)"
        case .rectangle(let origin, let width, let height):
            return "Rectangle at \(origin.description) (\(width) x \(height))"
        case .triangle(let p1, let p2, let p3):
            return "Triangle with vertices \(p1.description), \(p2.description), \(p3.description)"
        }
    }
    
    var area: Double {
        switch self {
        case .circle(_, let radius):
            return Double.pi * radius * radius
        case .rectangle(_, let width, let height):
            return width * height
        case .triangle(let p1, let p2, let p3):
            // Using cross product formula
            return abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)) / 2
        }
    }
}

// Class with optionals
class ShapeCollection {
    private var shapes: [Shape] = []
    
    func add(_ shape: Shape) {
        shapes.append(shape)
    }
    
    func totalArea() -> Double {
        return shapes.reduce(0) { $0 + $1.area }
    }
    
    func findLargest() -> Shape? {
        return shapes.max { $0.area < $1.area }
    }
    
    func printAll() {
        for (index, shape) in shapes.enumerated() {
            print("[\(index)] \(shape.description) - Area: \(String(format: "%.2f", shape.area))")
        }
    }
}

// Extension
extension Double {
    var squared: Double {
        return self * self
    }
}

// Main execution
let collection = ShapeCollection()

collection.add(.circle(center: Point(x: 0, y: 0), radius: 5))
collection.add(.rectangle(origin: Point(x: 10, y: 10), width: 4, height: 6))
collection.add(.triangle(p1: Point(x: 0, y: 0), p2: Point(x: 4, y: 0), p3: Point(x: 2, y: 3)))

print("All shapes:")
collection.printAll()

print("\nTotal area: \(String(format: "%.2f", collection.totalArea()))")

if let largest = collection.findLargest() {
    print("Largest shape: \(largest.description)")
}
