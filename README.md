# 🔐 Login & Token Handling
On load, a UUIDv4 token is generated and inserted into the login input.

Token validity is checked via regex.

On clicking the LOGIN button:

A request is sent to GET /category

The response populates the list of categories.

# 📁 Category Behavior
Clicking a category title toggles its expansion.

On expansion:

Sends a request to GET /memo?category_id=

Memo items (#memo-<id>) are rendered as direct children of the category container (#category-<id>).

Only one category is expanded at a time.

# 📝 Memo Actions
1. Add Memo (+ NEW)
Enabled only when a category is expanded.

Sends POST /memo with dummy title/content.

New memo is:

Inserted into the memo list.

Immediately selected for editing.

2. Edit Memo
Selecting a memo:

Sends GET /memo/{id}

Populates #memo-title and #memo-content inputs.

Editing fields and clicking SAVE sends PUT /memo/{id} with updates.

3. Delete Memo
Clicking DELETE sends DELETE /memo/{id}

Removes memo from UI and clears the form.

# 🧼 UX Safeguards
Inputs/buttons are disabled when no memo is selected.

Memo elements are only rendered when visible (no hidden DOM elements).