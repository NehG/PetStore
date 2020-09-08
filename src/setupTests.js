import "jest-localstorage-mock";

// making sure our test's with persitent storage doesn't give side effect to UI
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});
