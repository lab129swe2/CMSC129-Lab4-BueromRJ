const {
  normalizeCreateTask,
  normalizeUpdateTask,
  applyTaskPatch,
} = require("../../src/domain/taskDomain");

describe("task domain logic", () => {
  test("normalizeCreateTask trims title and defaults status to todo", () => {
    const created = normalizeCreateTask({ title: "  Buy milk  " });
    expect(created).toEqual(
      expect.objectContaining({
        title: "Buy milk",
        status: "todo",
      }),
    );
  });

  test("normalizeCreateTask throws a validation error when title is blank", () => {
    expect(() => normalizeCreateTask({ title: "   " })).toThrow(/title/i);
  });

  test("normalizeUpdateTask rejects an empty patch", () => {
    expect(() => normalizeUpdateTask({})).toThrow(/patch/i);
  });

  test("applyTaskPatch updates only provided fields", () => {
    const task = {
      id: "t1",
      title: "Old",
      status: "todo",
      description: "keep",
      createdAt: 1,
      updatedAt: 1,
    };

    const updated = applyTaskPatch(task, { title: "New" });

    expect(updated).toEqual(
      expect.objectContaining({
        id: "t1",
        title: "New",
        status: "todo",
        description: "keep",
        createdAt: 1,
      }),
    );
  });
});

