# AuthUtils Usage Examples

The `AuthUtils` class provides static methods for checking authentication status throughout the application without causing circular dependencies.

## Basic Usage

```typescript
import { AuthUtils } from "../core/utils";

// Check if user is logged in
if (AuthUtils.isUserLoggedIn()) {
  // User is authenticated
  console.log("User is logged in");
} else {
  // User is not authenticated
  console.log("User is not logged in");
}

// Get current user data
const user = AuthUtils.getCurrentUser();
if (user) {
  console.log("Current user:", user);
}

// Get user token
const token = AuthUtils.getUserToken();
if (token) {
  console.log("User token:", token);
}

// Get user role
const role = AuthUtils.getUserRole();
console.log("User role:", role);

// Check specific roles
if (AuthUtils.isAdmin()) {
  console.log("User is an admin");
}

if (AuthUtils.isClient()) {
  console.log("User is a client/patient");
}

if (AuthUtils.isPharmacy()) {
  console.log("User is a pharmacy");
}

// Check for specific role
if (AuthUtils.hasRole("Manager")) {
  console.log("User is a manager");
}
```

## Usage in Components

```typescript
import { Component } from "@angular/core";
import { AuthUtils } from "../../core/utils";

@Component({
  selector: "app-example",
  template: `
    <div *ngIf="isLoggedIn">
      <h2>Welcome, {{ currentUser?.userName }}!</h2>
      <p>Your role: {{ userRole }}</p>
    </div>
    <div *ngIf="!isLoggedIn">
      <p>Please log in to continue</p>
    </div>
  `,
})
export class ExampleComponent {
  get isLoggedIn(): boolean {
    return AuthUtils.isUserLoggedIn();
  }

  get currentUser() {
    return AuthUtils.getCurrentUser();
  }

  get userRole(): string | null {
    return AuthUtils.getUserRole();
  }

  get isAdmin(): boolean {
    return AuthUtils.isAdmin();
  }
}
```

## Usage in Services

```typescript
import { Injectable } from "@angular/core";
import { AuthUtils } from "../core/utils";

@Injectable({
  providedIn: "root",
})
export class SomeService {
  performAction() {
    if (!AuthUtils.isUserLoggedIn()) {
      throw new Error("User must be logged in");
    }

    const userRole = AuthUtils.getUserRole();
    if (userRole === "Admin") {
      // Admin-specific logic
    } else if (userRole === "Client") {
      // Client-specific logic
    }
  }
}
```

## Usage in Guards

```typescript
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthUtils } from "../core/utils";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (AuthUtils.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (AuthUtils.isAdmin()) {
      return true;
    } else {
      this.router.navigate(["/unauthorized"]);
      return false;
    }
  }
}
```

## Benefits

1. **No Circular Dependencies**: Static utility class doesn't require dependency injection
2. **Global Access**: Can be used anywhere in the application
3. **Type Safety**: Fully typed methods with proper return types
4. **Error Handling**: Built-in error handling and data validation
5. **Performance**: Efficient token expiration checking
6. **Clean Code**: Centralized authentication logic
