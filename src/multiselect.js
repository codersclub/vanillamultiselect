class MultiSelect {
    constructor(el, options = {}) {
        this.select = el;

        this.options = Object.assign({
            searchable: false,
            searchPlaceholder: "Search..."
        }, options);

        this.state = {
            isOpen: false,
            values: new Set(),
            search: ""
        };

        this.#init();
    }

    /* ================= INIT ================= */

    #init() {
        this.#hideNativeSelect();
        this.#build();
        this.#bind();
        this.#syncFromSelect();
        this.#renderOptions();
        this.#renderTags();
        this.#toggleClearButton();
    }

    /* ================= BUILD ================= */

    #hideNativeSelect() {
        this.select.style.display = 'none';
    }

    #build() {
        this.container = document.createElement('div');
        this.container.className = 'vms';

        this.selection = document.createElement('div');
        this.selection.className = 'vms-selection';

        this.tags = document.createElement('div');
        this.tags.className = 'vms-tags';

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'vms-toggle';
        this.toggleBtn.type = 'button';
        this.toggleBtn.textContent = '+';

        this.dropdown = document.createElement('div');
        this.dropdown.className = 'vms-dropdown';

        /* ===== SEARCH ===== */
        this.searchWrap = document.createElement('div');
        this.searchWrap.className = 'vms-search-wrap';

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'vms-search';
        this.searchInput.placeholder = this.options.searchPlaceholder;

        /* NEW: clear button */
        this.searchClear = document.createElement('button');
        this.searchClear.type = 'button';
        this.searchClear.className = 'vms-search-clear';
        this.searchClear.textContent = '×';

        this.searchWrap.appendChild(this.searchInput);
        this.searchWrap.appendChild(this.searchClear);

        this.optionsList = document.createElement('div');
        this.optionsList.className = 'vms-options';

        if (this.options.searchable) {
            this.dropdown.appendChild(this.searchWrap);
        }

        this.dropdown.appendChild(this.optionsList);

        this.selection.appendChild(this.tags);
        this.selection.appendChild(this.toggleBtn);

        this.container.appendChild(this.selection);
        this.container.appendChild(this.dropdown);

        this.select.parentNode.insertBefore(this.container, this.select);
    }

    #toggleClearButton() {
        if (!this.options.searchable) return;

        if (this.searchInput.value.length > 0) {
            this.searchClear.style.display = 'block';
        } else {
            this.searchClear.style.display = 'none';
        }
    }

    /* ================= EVENTS ================= */

    #bind() {
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        if (this.options.searchable) {
            this.searchInput.addEventListener('input', () => {
                this.state.search = this.searchInput.value.toLowerCase();
                this.#renderOptions();
            });
        }

        if (this.options.searchable) {

            this.searchInput.addEventListener('input', () => {
                this.state.search = this.searchInput.value.toLowerCase();
                this.#renderOptions();
                this.#toggleClearButton();
            });

            this.searchClear.addEventListener('click', () => {
                this.searchInput.value = '';
                this.state.search = '';
                this.#renderOptions();
                this.#toggleClearButton();
                this.searchInput.focus();
            });
        }
    }

    /* ================= STATE ================= */

    #syncFromSelect() {
        Array.from(this.select.options).forEach(opt => {
            if (opt.selected && opt.value) {
                this.state.values.add(opt.value);
            }
        });
    }

    /* ================= OPTIONS ================= */

    #renderOptions() {
        this.optionsList.innerHTML = '';

        Array.from(this.select.options).forEach(opt => {
            if (!opt.value) return;

            /* FILTER */
            if (this.state.search) {
                if (!opt.text.toLowerCase().includes(this.state.search)) {
                    return;
                }
            }

            const label = document.createElement('label');
            label.className = 'vms-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = opt.value;
            checkbox.checked = this.state.values.has(opt.value);

            checkbox.addEventListener('change', () => {
                this.#toggleValue(opt.value, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(opt.text));

            this.optionsList.appendChild(label);
        });
    }

    /* ================= TAGS ================= */

    #renderTags() {
        this.tags.innerHTML = '';

        this.state.values.forEach(value => {
            const opt = Array.from(this.select.options)
                .find(o => o.value === value);

            if (!opt) return;

            const tag = document.createElement('span');
            tag.className = 'vms-tag';

            const text = document.createElement('span');
            text.textContent = opt.text;

            const remove = document.createElement('span');
            remove.className = 'vms-remove';
            remove.textContent = '×';

            remove.addEventListener('click', () => {
                this.state.values.delete(value);
                this.#commit();
            });

            tag.appendChild(text);
            tag.appendChild(remove);

            this.tags.appendChild(tag);
        });
    }

    /* ================= CORE ================= */

    #toggleValue(value, checked) {
        if (checked) {
            this.state.values.add(value);
        } else {
            this.state.values.delete(value);
        }

        this.#commit();
    }

    #commit() {
        this.#syncToSelect();
        this.#renderTags();
        this.#renderOptions();
        this.#dispatchChange();
    }

    #syncToSelect() {
        Array.from(this.select.options).forEach(opt => {
            opt.selected = this.state.values.has(opt.value);
        });
    }

    /* ================= EVENTS ================= */

    #dispatchChange() {
        const event = new CustomEvent("vms:change", {
            detail: {
                values: Array.from(this.state.values)
            }
        });

        this.select.dispatchEvent(event);
    }

    /* ================= OPEN / CLOSE ================= */

    toggle() {
        this.state.isOpen ? this.close() : this.open();
    }

    open() {
        this.state.isOpen = true;
        this.dropdown.classList.add('open');
    }

    close() {
        this.state.isOpen = false;
        this.dropdown.classList.remove('open');
    }
}

/* ================= AUTO INIT ================= */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.multi-select').forEach(el => {
        new MultiSelect(el);
    });
});
