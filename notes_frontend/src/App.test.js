import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders notes app main parts", () => {
  render(<App />);
  // Should have search box
  expect(screen.getByPlaceholderText(/Search notes/i)).toBeInTheDocument();
  // New note button should be visible
  expect(screen.getByText("+ New Note")).toBeInTheDocument();
  // Sidebar and notes list appears
  expect(screen.getByLabelText("Main sidebar")).toBeInTheDocument();
  expect(screen.getByLabelText("Notes list")).toBeInTheDocument();
  // There should be at least one demo note
  expect(screen.getAllByTestId("note-item").length).toBeGreaterThan(0);
});

test("can create, select, edit and delete note", () => {
  render(<App />);
  // Click new note
  fireEvent.click(screen.getByText("+ New Note"));
  // Input should be present
  const titleInput = screen.getByTestId("editor-title");
  fireEvent.change(titleInput, { target: { value: "My Test Note" } });
  expect(titleInput.value).toBe("My Test Note");
  // Content edit
  const contentBox = screen.getByTestId("editor-content");
  fireEvent.change(contentBox, { target: { value: "This is awesome." } });
  expect(contentBox.value).toBe("This is awesome.");
  // Now delete it
  fireEvent.click(screen.getByTestId("delete-btn"));
});
