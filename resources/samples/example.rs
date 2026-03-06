//! Rust Example - Demonstrates structs, traits, and error handling
//! Use this file to validate Rust extension support on VFS

use std::fmt;

/// A simple point in 2D space
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    /// Creates a new point
    pub fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }

    /// Calculates distance from origin
    pub fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }

    /// Calculates distance to another point
    pub fn distance_to(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

/// A trait for shapes
pub trait Shape {
    fn area(&self) -> f64;
    fn perimeter(&self) -> f64;
}

/// A rectangle defined by two points
pub struct Rectangle {
    pub top_left: Point,
    pub bottom_right: Point,
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        let width = (self.bottom_right.x - self.top_left.x).abs();
        let height = (self.bottom_right.y - self.top_left.y).abs();
        width * height
    }

    fn perimeter(&self) -> f64 {
        let width = (self.bottom_right.x - self.top_left.x).abs();
        let height = (self.bottom_right.y - self.top_left.y).abs();
        2.0 * (width + height)
    }
}

fn main() {
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);
    
    println!("Point 1: {}", p1);
    println!("Point 2: {}", p2);
    println!("Distance: {}", p1.distance_to(&p2));

    let rect = Rectangle {
        top_left: Point::new(0.0, 10.0),
        bottom_right: Point::new(10.0, 0.0),
    };
    
    println!("Rectangle area: {}", rect.area());
    println!("Rectangle perimeter: {}", rect.perimeter());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_distance() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(3.0, 4.0);
        assert_eq!(p1.distance_to(&p2), 5.0);
    }
}
