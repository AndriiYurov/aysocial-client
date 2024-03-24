import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "../components/Nav";
import { UserProvider } from "../context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/router";
import Login from "../pages/login";
import PostPublic from "../components/cards/PostPublic";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("App", () => {
  it("navigation bar", () => {
    //mockRouter.push("/")
    render(
      <UserProvider>
        <Nav />
      </UserProvider>
    );
    const login = screen.getByText(/Login/i);
    const register = screen.getByText(/Register/i);
    expect(login).toBeInTheDocument();
    expect(register).toBeInTheDocument();
  });
  it("login page present", () => {
    render(
      <GoogleOAuthProvider>
        <UserProvider>
          <Login />
        </UserProvider>
      </GoogleOAuthProvider>
    );
    const email = screen.getByPlaceholderText(/Enter email/i);
    const password = screen.getByPlaceholderText(/Enter password/i);
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /Submit/i });
    expect(btn).toBeDisabled();
  });

  it("public posts", () => {
    const post = {
      content: "Test content",
      postedBy: { user: "testUser1", image: undefined },
      _id: 1,
      likes: ["testUser1", "testUser2"],
      comments: [
        {
          text: "Test comment",
          postedBy: {
            image: undefined,
          },
        },
      ],
    };
    render(
      <UserProvider>
        <PostPublic post={post} />
      </UserProvider>
    );
    const text = screen.getByText(/Test content/i);
    const comment = screen.getByText(/Test comment/i);
    const likes = screen.getByText(`${post.likes.length} likes`)
    expect(text).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
    expect(likes).toBeInTheDocument();
  });
});
