import * as vscode from 'vscode';

export class VirtualFileSystemProvider implements vscode.FileSystemProvider {
    private _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile = this._onDidChangeFile.event;

    // Make files and directories accessible for search providers
    public readonly files = new Map<string, Uint8Array>();
    public readonly directories = new Set<string>();

    constructor() {
        this.initializeSampleFiles();
    }

    private initializeSampleFiles() {
        // Initialize with 11 sample files with different types of code
        const sampleFiles = [
            {
                path: '/hello.js',
                content: `// JavaScript Hello World
console.log('Hello, Virtual File System!');

function greet(name) {
    return \`Hello, \${name}!\`;
}

module.exports = { greet };`
            },
            {
                path: '/calculator.py',
                content: `# Python Calculator
def add(a, b):
    """Add two numbers"""
    return a + b

def subtract(a, b):
    """Subtract two numbers"""
    return a - b

def multiply(a, b):
    """Multiply two numbers"""
    return a * b

def divide(a, b):
    """Divide two numbers"""
    if b != 0:
        return a / b
    else:
        raise ValueError("Cannot divide by zero")

if __name__ == "__main__":
    print("Calculator module loaded")`
            },
            {
                path: '/person.ts',
                content: `// TypeScript Class Example
interface IPerson {
    name: string;
    age: number;
    email: string;
}

export class Person implements IPerson {
    constructor(
        public name: string,
        public age: number,
        public email: string
    ) {}

    greet(): string {
        return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
    }

    getEmail(): string {
        return this.email;
    }

    isAdult(): boolean {
        return this.age >= 18;
    }
}`
            },
            {
                path: '/styles.css',
                content: `/* CSS Styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #2980b9;
}`
            },
            {
                path: '/index.html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual File System Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1 class="header">Welcome to Virtual File System</h1>
        <p>This is a sample HTML file in our virtual file system.</p>
        <button class="button" onclick="greetUser()">Click Me!</button>
        <div id="output"></div>
    </div>
    
    <script>
        function greetUser() {
            document.getElementById('output').innerHTML = 
                '<p>Hello from the virtual file system!</p>';
        }
    </script>
</body>
</html>`
            },
            {
                path: '/config.json',
                content: `{
    "name": "Virtual File System Config",
    "version": "1.0.0",
    "settings": {
    "description": "Example .json for information purposes",
        "theme": "dark",
        "autoSave": true,
        "maxFileSize": "10MB",
        "supportedExtensions": [
            ".js",
            ".ts",
            ".py",
            ".html",
            ".css",
            ".json",
            ".md",
            ".txt",".tex"
        ]
    },
    "features": {
        "syntaxHighlighting": true,
        "autoComplete": true,
        "errorChecking": true
    }
}`
            },
            {
                path: '/document.tex',
                content: `\\documentclass{article}
\\title{Sample Document}
\\author{Virtual File System}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
This is a simple LaTeX document in the virtual file system.

\\end{document}`
            },
            {
                path: '/README.md',
                content: `# Virtual File System Demo

This is a demonstration of a virtual file system implemented as a VS Code extension.

## Features

- ✅ Custom FileSystemProvider implementation
- ✅ In-memory file storage
- ✅ Sample files with different programming languages
- ✅ Read/Write operations
- ✅ Directory structure support

## Sample Files Included

1. **hello.js** - JavaScript hello world example
2. **calculator.py** - Python calculator with basic operations
3. **person.ts** - TypeScript class definition
4. **styles.css** - CSS styling examples
5. **index.html** - HTML page with embedded JavaScript
6. **config.json** - Configuration file example
7. **README.md** - This documentation file
8. **todo.txt** - Simple text file with tasks
9. **api.go** - Go REST API example
10. **package.json** - Node.js package configuration

## Usage

1. Mount the virtual file system using the command palette
2. Browse files in the explorer
3. Edit files directly in VS Code
4. Changes are stored in memory

## Technical Details

The file system uses the VS Code FileSystemProvider API to create a virtual file system that exists entirely in memory.
`
            },
            {
                path: '/todo.txt',
                content: `TODO List - Virtual File System Project

[ ] Implement file watching functionality
[ ] Add file search capabilities
[ ] Create file templates
[ ] Add file compression support
[ ] Implement file versioning
[x] Create sample files
[x] Implement basic CRUD operations
[x] Add TypeScript support
[x] Create VS Code extension structure

Notes:
- Remember to test all file operations
- Consider adding more language examples
- Think about adding syntax highlighting improvements
- Document the API for other developers`
            },
            {
                path: '/api.go',
                content: `// Go REST API Example
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

var users []User
var nextID = 1

func getUsers(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func getUser(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id, _ := strconv.Atoi(params["id"])
    
    for _, user := range users {
        if user.ID == id {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(user)
            return
        }
    }
    
    http.Error(w, "User not found", http.StatusNotFound)
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    json.NewDecoder(r.Body).Decode(&user)
    user.ID = nextID
    nextID++
    users = append(users, user)
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func main() {
    router := mux.NewRouter()
    
    router.HandleFunc("/users", getUsers).Methods("GET")
    router.HandleFunc("/users/{id}", getUser).Methods("GET")
    router.HandleFunc("/users", createUser).Methods("POST")
    
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}`
            },
            {
                path: '/sample-package.json',
                content: `{
    "name": "virtual-file-system-demo",
    "version": "1.0.0",
    "description": "A demo package for the virtual file system",
    "main": "hello.js",
    "scripts": {
        "start": "node hello.js",
        "test": "echo \\"Error: no test specified\\" && exit 1",
        "build": "tsc",
        "dev": "nodemon hello.js"
    },
    "keywords": [
        "virtual",
        "filesystem",
        "demo",
        "vscode",
        "extension"
    ],
    "author": "Virtual File System Extension",
    "license": "MIT",
    "dependencies": {
        "express": "^4.18.0",
        "lodash": "^4.17.21"
    },
    "devDependencies": {
        "@types/node": "^18.0.0",
        "nodemon": "^2.0.0",
        "typescript": "^4.9.0"
    }
}`
            },
            // LaTeX multi-file project
            {
                path: '/papers/main.tex',
                content: `\\documentclass[12pt,a4paper]{article}

% ============================================
% PACKAGES
% ============================================
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath,amssymb,amsthm}   % Math typesetting
\\usepackage{graphicx}                 % Images
\\usepackage{booktabs}                 % Professional tables
\\usepackage{hyperref}                 % Clickable links
\\usepackage{cleveref}                 % Smart cross-references
\\usepackage{tikz}                     % Diagrams
\\usepackage[ruled,vlined]{algorithm2e} % Algorithms
\\usepackage{lipsum}                   % Dummy text

% ============================================
% CUSTOM COMMANDS
% ============================================
\\newcommand{\\R}{\\mathbb{R}}          % Real numbers
\\newcommand{\\N}{\\mathbb{N}}          % Natural numbers
\\newcommand{\\E}{\\mathbb{E}}          % Expectation
\\newcommand{\\Var}{\\operatorname{Var}} % Variance
\\newcommand{\\norm}[1]{\\left\\lVert#1\\right\\rVert}
\\newcommand{\\abs}[1]{\\left|#1\\right|}

% Theorem environments
\\newtheorem{theorem}{Theorem}[section]
\\newtheorem{lemma}[theorem]{Lemma}
\\newtheorem{definition}[theorem]{Definition}

% ============================================
% DOCUMENT INFO
% ============================================
\\title{A Comprehensive Guide to Statistical Learning\\\\
       \\large Demonstrating LaTeX Features}
\\author{Dr.~Jane Smith\\thanks{Virtual University, Dept. of Computer Science} \\and 
        Prof.~John Doe\\thanks{Institute for Advanced Study}}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
This document demonstrates a multi-file LaTeX project structure
with cross-references, mathematical notation, tables, figures,
algorithms, and bibliography management. We explore fundamental
concepts in statistical learning theory.
\\end{abstract}

\\tableofcontents
\\newpage

% Include chapter files
\\input{chapters/introduction}
\\input{chapters/methods}
\\input{chapters/results}

% Bibliography
\\bibliographystyle{plain}
\\bibliography{bib/references}

\\end{document}`
            },
            {
                path: '/papers/chapters/introduction.tex',
                content: `% ============================================
% INTRODUCTION CHAPTER
% ============================================

\\section{Introduction}
\\label{sec:introduction}

Statistical learning theory provides the mathematical foundation
for machine learning algorithms. As noted by \\cite{vapnik1998},
the goal is to find patterns in data that generalize well.

\\subsection{Motivation}
\\label{subsec:motivation}

Consider a dataset $\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^{n}$ where
$x_i \\in \\R^d$ and $y_i \\in \\{-1, +1\\}$. Our objective is to
learn a function $f: \\R^d \\to \\{-1, +1\\}$ that minimizes the
\\emph{generalization error}.

\\begin{definition}[Generalization Error]
\\label{def:gen-error}
For a hypothesis $h$ and distribution $\\mathcal{P}$, the
generalization error is:
\\begin{equation}
\\label{eq:gen-error}
R(h) = \\E_{(x,y) \\sim \\mathcal{P}}\\left[\\mathbf{1}_{h(x) \\neq y}\\right]
\\end{equation}
\\end{definition}

We will explore this concept further in \\Cref{sec:methods}.

\\subsection{Document Overview}

This paper is organized as follows:
\\begin{itemize}
    \\item \\Cref{sec:methods} presents mathematical frameworks
    \\item \\Cref{sec:results} shows experimental results
    \\item We conclude with a discussion of future work
\\end{itemize}

The key theorem (\\Cref{thm:main}) appears in \\Cref{sec:methods}.`
            },
            {
                path: '/papers/chapters/methods.tex',
                content: `% ============================================
% METHODS CHAPTER
% ============================================

\\section{Methods}
\\label{sec:methods}

Building on \\Cref{def:gen-error} from the introduction, we now
develop the theoretical framework.

\\subsection{Mathematical Framework}

\\begin{theorem}[PAC Learning Bound]
\\label{thm:main}
Let $\\mathcal{H}$ be a hypothesis class with VC dimension $d$.
For any $\\delta > 0$, with probability at least $1 - \\delta$:
\\begin{equation}
\\label{eq:pac-bound}
R(h) \\leq \\hat{R}(h) + \\sqrt{\\frac{d \\log(2n/d) + \\log(4/\\delta)}{n}}
\\end{equation}
where $\\hat{R}(h)$ is the empirical risk.
\\end{theorem}

\\begin{proof}
The proof follows from uniform convergence bounds. See \\cite{shalev2014}
for complete details.
\\end{proof}

\\subsection{Matrix Operations}

Consider the covariance matrix $\\Sigma \\in \\R^{d \\times d}$:
\\begin{equation}
\\Sigma = \\begin{pmatrix}
\\sigma_1^2 & \\rho_{12} & \\cdots & \\rho_{1d} \\\\
\\rho_{21} & \\sigma_2^2 & \\cdots & \\rho_{2d} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
\\rho_{d1} & \\rho_{d2} & \\cdots & \\sigma_d^2
\\end{pmatrix}
\\end{equation}

The eigenvalue decomposition yields $\\Sigma = U \\Lambda U^\\top$.

\\subsection{Algorithm}

\\begin{algorithm}[H]
\\caption{Gradient Descent for Empirical Risk Minimization}
\\label{alg:gd}
\\KwIn{Dataset $\\mathcal{D}$, learning rate $\\eta$, iterations $T$}
\\KwOut{Optimized parameters $\\theta^*$}
Initialize $\\theta_0$ randomly\\;
\\For{$t = 1$ \\KwTo $T$}{
    Compute gradient: $g_t \\gets \\nabla_\\theta \\hat{R}(\\theta_{t-1})$\\;
    Update: $\\theta_t \\gets \\theta_{t-1} - \\eta \\cdot g_t$\\;
    \\If{$\\norm{g_t} < \\epsilon$}{
        \\textbf{break}\\;
    }
}
\\Return $\\theta_T$\\;
\\end{algorithm}

See \\Cref{alg:gd} for the complete procedure.

\\subsection{Aligned Equations}

The loss function and its gradient:
\\begin{align}
\\mathcal{L}(\\theta) &= \\frac{1}{n} \\sum_{i=1}^{n} \\ell(h_\\theta(x_i), y_i) + \\lambda \\norm{\\theta}^2 \\label{eq:loss} \\\\
\\nabla \\mathcal{L}(\\theta) &= \\frac{1}{n} \\sum_{i=1}^{n} \\nabla_\\theta \\ell(h_\\theta(x_i), y_i) + 2\\lambda\\theta \\label{eq:grad}
\\end{align}

\\Cref{eq:loss,eq:grad} define the optimization objective.`
            },
            {
                path: '/papers/chapters/results.tex',
                content: `% ============================================
% RESULTS CHAPTER
% ============================================

\\section{Results}
\\label{sec:results}

We validate our approach from \\Cref{sec:methods} empirically.

\\subsection{Experimental Setup}

Experiments were conducted using parameters from \\Cref{tab:params}.

\\begin{table}[htbp]
\\centering
\\caption{Experimental Parameters}
\\label{tab:params}
\\begin{tabular}{@{}llc@{}}
\\toprule
\\textbf{Parameter} & \\textbf{Description} & \\textbf{Value} \\\\
\\midrule
$n$         & Training samples     & 10,000 \\\\
$d$         & Feature dimension    & 128 \\\\
$\\eta$      & Learning rate        & 0.01 \\\\
$\\lambda$   & Regularization       & $10^{-4}$ \\\\
$T$         & Max iterations       & 1,000 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{Performance Comparison}

\\Cref{tab:results} summarizes the classification accuracy.

\\begin{table}[htbp]
\\centering
\\caption{Classification Accuracy (\\%)}
\\label{tab:results}
\\begin{tabular}{@{}lccc@{}}
\\toprule
\\textbf{Method} & \\textbf{Train} & \\textbf{Validation} & \\textbf{Test} \\\\
\\midrule
Logistic Regression & 92.3 & 89.1 & 88.7 \\\\
SVM (RBF kernel)    & 95.1 & 91.2 & 90.8 \\\\
Neural Network      & 98.2 & 92.5 & 91.3 \\\\
\\textbf{Our Method} & \\textbf{97.8} & \\textbf{93.1} & \\textbf{92.4} \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{Visualization}

\\Cref{fig:architecture} shows the model architecture.

\\begin{figure}[htbp]
\\centering
\\begin{tikzpicture}[
    node distance=1.5cm,
    box/.style={rectangle, draw, minimum width=2cm, minimum height=0.8cm}
]
    \\node[box] (input) {Input $x$};
    \\node[box, right of=input, xshift=1.5cm] (hidden) {Hidden Layer};
    \\node[box, right of=hidden, xshift=1.5cm] (output) {Output $\\hat{y}$};
    
    \\draw[->] (input) -- (hidden);
    \\draw[->] (hidden) -- (output);
\\end{tikzpicture}
\\caption{Neural network architecture with one hidden layer.}
\\label{fig:architecture}
\\end{figure}

\\subsection{Discussion}

Our results confirm \\Cref{thm:main}: the generalization gap
decreases as $O(1/\\sqrt{n})$. The bound in \\Cref{eq:pac-bound}
provides a theoretical guarantee consistent with empirical
observations in \\Cref{tab:results}.

\\paragraph{Limitations.} The current analysis assumes i.i.d. data,
which may not hold in practice \\cite{bishop2006}.`
            },
            {
                path: '/papers/bib/references.bib',
                content: `% ============================================
% BIBLIOGRAPHY DATABASE
% ============================================

@book{vapnik1998,
    author    = {Vladimir N. Vapnik},
    title     = {Statistical Learning Theory},
    publisher = {Wiley-Interscience},
    year      = {1998},
    address   = {New York},
    isbn      = {978-0471030034}
}

@book{shalev2014,
    author    = {Shai Shalev-Shwartz and Shai Ben-David},
    title     = {Understanding Machine Learning: From Theory to Algorithms},
    publisher = {Cambridge University Press},
    year      = {2014},
    isbn      = {978-1107057135}
}

@book{bishop2006,
    author    = {Christopher M. Bishop},
    title     = {Pattern Recognition and Machine Learning},
    publisher = {Springer},
    year      = {2006},
    series    = {Information Science and Statistics},
    isbn      = {978-0387310732}
}

@article{lecun2015,
    author  = {Yann LeCun and Yoshua Bengio and Geoffrey Hinton},
    title   = {Deep Learning},
    journal = {Nature},
    year    = {2015},
    volume  = {521},
    number  = {7553},
    pages   = {436--444},
    doi     = {10.1038/nature14539}
}

@inproceedings{krizhevsky2012,
    author    = {Alex Krizhevsky and Ilya Sutskever and Geoffrey E. Hinton},
    title     = {ImageNet Classification with Deep Convolutional Neural Networks},
    booktitle = {Advances in Neural Information Processing Systems},
    year      = {2012},
    pages     = {1097--1105}
}`
            }
        ];

        // Create root directory
        this.directories.add('/');

        // Create directories for LaTeX project
        this.directories.add('/papers');
        this.directories.add('/papers/chapters');
        this.directories.add('/papers/bib');

        // Add each sample file
        for (const file of sampleFiles) {
            this.files.set(file.path, Buffer.from(file.content, 'utf8'));
        }
    }

    watch(uri: vscode.Uri): vscode.Disposable {
        // For simplicity, we don't implement actual file watching
        return new vscode.Disposable(() => { });
    }

    stat(uri: vscode.Uri): vscode.FileStat {
        const path = uri.path;

        if (this.directories.has(path)) {
            return {
                type: vscode.FileType.Directory,
                ctime: Date.now(),
                mtime: Date.now(),
                size: 0
            };
        }

        if (this.files.has(path)) {
            const content = this.files.get(path)!;
            return {
                type: vscode.FileType.File,
                ctime: Date.now(),
                mtime: Date.now(),
                size: content.length
            };
        }

        throw vscode.FileSystemError.FileNotFound(uri);
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        const path = uri.path;

        if (!this.directories.has(path)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        const entries: [string, vscode.FileType][] = [];

        // Add files in this directory
        for (const filePath of this.files.keys()) {
            if (this.isDirectChild(path, filePath)) {
                const fileName = this.getFileName(filePath);
                entries.push([fileName, vscode.FileType.File]);
            }
        }

        // Add subdirectories
        for (const dirPath of this.directories) {
            if (this.isDirectChild(path, dirPath) && dirPath !== path) {
                const dirName = this.getFileName(dirPath);
                entries.push([dirName, vscode.FileType.Directory]);
            }
        }

        return entries;
    }

    private isDirectChild(parentPath: string, childPath: string): boolean {
        if (parentPath === '/') {
            return childPath.startsWith('/') && childPath.indexOf('/', 1) === -1 && childPath !== '/';
        }

        if (!childPath.startsWith(parentPath + '/')) {
            return false;
        }

        const relativePath = childPath.substring(parentPath.length + 1);
        return relativePath.indexOf('/') === -1;
    }

    private getFileName(path: string): string {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    createDirectory(uri: vscode.Uri): void {
        const path = uri.path;

        if (this.directories.has(path) || this.files.has(path)) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        this.directories.add(path);
        this._onDidChangeFile.fire([{
            type: vscode.FileChangeType.Created,
            uri
        }]);
    }

    readFile(uri: vscode.Uri): Uint8Array {
        const path = uri.path;
        const content = this.files.get(path);

        if (!content) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        return content;
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void {
        const path = uri.path;
        const exists = this.files.has(path);

        if (exists && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        if (!exists && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        this.files.set(path, content);

        const changeType = exists ? vscode.FileChangeType.Changed : vscode.FileChangeType.Created;
        this._onDidChangeFile.fire([{
            type: changeType,
            uri
        }]);
    }

    delete(uri: vscode.Uri, options: { recursive: boolean }): void {
        const path = uri.path;

        if (this.files.has(path)) {
            this.files.delete(path);
        } else if (this.directories.has(path)) {
            if (options.recursive) {
                // Delete all files and subdirectories
                const toDelete = [];
                for (const filePath of this.files.keys()) {
                    if (filePath.startsWith(path + '/')) {
                        toDelete.push(filePath);
                    }
                }
                for (const filePath of toDelete) {
                    this.files.delete(filePath);
                }

                const dirsToDelete = [];
                for (const dirPath of this.directories) {
                    if (dirPath.startsWith(path + '/')) {
                        dirsToDelete.push(dirPath);
                    }
                }
                for (const dirPath of dirsToDelete) {
                    this.directories.delete(dirPath);
                }
            }
            this.directories.delete(path);
        } else {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        this._onDidChangeFile.fire([{
            type: vscode.FileChangeType.Deleted,
            uri
        }]);
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
        const oldPath = oldUri.path;
        const newPath = newUri.path;

        if (this.files.has(oldPath)) {
            const content = this.files.get(oldPath)!;

            if (this.files.has(newPath) && !options.overwrite) {
                throw vscode.FileSystemError.FileExists(newUri);
            }

            this.files.set(newPath, content);
            this.files.delete(oldPath);

            this._onDidChangeFile.fire([
                { type: vscode.FileChangeType.Deleted, uri: oldUri },
                { type: vscode.FileChangeType.Created, uri: newUri }
            ]);
        } else {
            throw vscode.FileSystemError.FileNotFound(oldUri);
        }
    }
}
