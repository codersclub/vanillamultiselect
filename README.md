# VanillaMultiSelect

> Native HTML. Modern UI. Zero dependencies.

VanillaMultiSelect is a lightweight JavaScript component that enhances native `<select multiple>` elements without removing their HTML nature or accessibility.

It provides a modern multiselect UI with tags, search, and keyboard support while keeping the original `<select>` as the single source of truth.

---

## ✨ Features (planned for v1.0.0)

- Native `<select multiple>` enhancement
- Tag-based selection UI
- Search (optional)
- Select all / clear actions
- Keyboard navigation
- Click outside / ESC closing
- Fully dependency-free (Vanilla JS only)
- Multiple instances per page
- Accessible (ARIA-ready)

---

## 🚫 Non-goals

This library does NOT include:

- No jQuery
- No frameworks (React, Vue, Angular)
- No AJAX / data fetching
- No styling frameworks
- No external dependencies

---

## 📦 Installation

### Manual

```html
<link rel="stylesheet" href="src/multiselect.css">
<script src="src/multiselect.js"></script>
```

## 🚀 Usage

```html
<select class="multi-select" name="colors[]" multiple>
  <option value="1">Red</option>
  <option value="2">Green</option>
  <option value="3">Blue</option>
</select>

<script>
  document.querySelectorAll('.multi-select').forEach(el => {
    new MultiSelect(el, {
      searchable: true
    });
  });
</script>
```

## ⚙️ Options (WIP)

```javascript
{
  searchable: true,
  searchPlaceholder: "Search...",
  showSelectAll: true,
  showClearButton: true,
  collapseLabels: true,
  maxLabels: 5
}
```

## 🎯 Events (planned)

```javascript
select.addEventListener("vms:change", e => {
  console.log(e.detail.values);
});
```

## 📁 Project structure

```
vanillamultiselect/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── demo/
│   └── index.html
├── src/
│   ├── multiselect.js
│   └── multiselect.css
```

## 📜 License

MIT License

