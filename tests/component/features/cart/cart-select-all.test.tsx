import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CartSelectAll } from "@/features/cart/components/cart-select-all";

describe("cart select-all control", () => {
  it("is unchecked and enabled when some but not all eligible rows are selected", () => {
    render(
      <CartSelectAll
        eligibleCount={3}
        label="Select All"
        onClear={vi.fn()}
        onSelectAll={vi.fn()}
        selectedEligibleCount={1}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Select All" })).not.toBeChecked();
  });

  it("is checked when every eligible row is selected", () => {
    render(
      <CartSelectAll
        eligibleCount={3}
        label="Select All"
        onClear={vi.fn()}
        onSelectAll={vi.fn()}
        selectedEligibleCount={3}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Select All" })).toBeChecked();
  });

  it("is disabled when there are no eligible rows at all", () => {
    render(
      <CartSelectAll
        eligibleCount={0}
        label="Select All"
        onClear={vi.fn()}
        onSelectAll={vi.fn()}
        selectedEligibleCount={0}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Select All" })).toBeDisabled();
  });

  it("calls onSelectAll when activated from a partial or empty selection", async () => {
    const onSelectAll = vi.fn();
    const user = userEvent.setup();

    render(
      <CartSelectAll
        eligibleCount={3}
        label="Select All"
        onClear={vi.fn()}
        onSelectAll={onSelectAll}
        selectedEligibleCount={0}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select All" }));

    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it("calls onClear when unchecked from a fully-selected state", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(
      <CartSelectAll
        eligibleCount={3}
        label="Select All"
        onClear={onClear}
        onSelectAll={vi.fn()}
        selectedEligibleCount={3}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select All" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
