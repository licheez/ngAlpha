# AlphaPrimeScroller Design Decision

## Decision: Keep Simple Signal-Based Implementation

**Date:** 2026-03-10

## Context

The Angular 17 version had an `AlphaPrimeScrollerModel` class (208 lines) that wrapped:
- Collection operations (append, prepend, insert, remove, replace, find)
- Data loading via Observables
- Visibility tracking (visibleFrom/visibleTo)
- Debug properties (spaceAbove, paddingTop, etc.)

## Decision

**Rejected** creating a model class for the Angular 20 version.  
**Kept** the simple signal-based implementation in the component.

## Reasoning

### 1. **Thin Value Proposition**
The model methods mostly wrapped trivial JavaScript operations:
```typescript
// Model approach (old)
model.appendItem(item);  // Wraps: array.push()
model.removeItem(id, getId);  // Wraps: array.filter()

// Signal approach (current)
items.update(list => [...list, item]);  // Direct and clear
items.update(list => list.filter(i => getId(i) !== id));  // Explicit
```

### 2. **Mixed Responsibilities** 
The model violated Single Responsibility Principle by handling:
- ✅ Data storage (legitimate)
- ❌ Data fetching (should be external)
- ❌ Viewport calculations (component's job)
- ❌ Debug properties (pollutes API)

### 3. **Outdated Pattern**
- Old: Observable-based loading
- Current: Signal-based reactive state (Angular's modern approach)

### 4. **Hidden Complexity**
Methods like `removeItem` had complex return logic:
- Returns next item if available
- Or previous item if last
- Or null if empty

This mental overhead isn't worth it for operations that take one line with signals.

### 5. **Less Flexible**
The model forced a specific data management pattern. Current approach lets consumers:
- Use plain signals
- Implement their own state management
- Integrate with any data source
- Handle CRUD however they want

## Current Implementation Benefits

```typescript
export class AlphaPrimeScrollerComponent<T = any> {
  // Simple: Just store items
  private allItems = signal<T[]>([]);
  
  // Simple: One public method for adding
  addItems(newItems: T[]) {
    const current = this.allItems();
    this.allItems.set([...current, ...newItems]);
  }
  
  // Component handles its own concerns
  loading = signal(false);
  visibleRows = computed<VirtualRow<T>[]>(() => { /* ... */ });
  
  // Parent handles data fetching
  loadMore = output<number>();
}
```

**Advantages:**
- ✅ **Simple** - 164 lines vs 208+ lines with model
- ✅ **Modern** - Uses Angular signals throughout
- ✅ **Flexible** - Parent controls data management
- ✅ **Clear** - Separation of concerns
- ✅ **Maintainable** - Less code, less bugs
- ✅ **Transparent** - Standard patterns everyone understands

## Usage Pattern

```typescript
// Parent component manages data
@Component({ /* ... */ })
export class MyComponent {
  scroller = viewChild<AlphaPrimeScrollerComponent>('scroller');
  items = signal<Item[]>([]);
  
  onLoadMore(currentCount: number) {
    const scrollerRef = this.scroller();
    if (!scrollerRef) return;
    
    scrollerRef.loading.set(true);
    
    this.dataService.fetch(currentCount, 20).subscribe(newItems => {
      scrollerRef.addItems(newItems);
      scrollerRef.loading.set(false);
    });
  }
  
  // Direct CRUD operations when needed
  addItem(item: Item) {
    this.items.update(list => [...list, item]);
    this.scroller()?.addItems([item]);
  }
  
  removeItem(id: string) {
    this.items.update(list => list.filter(i => i.id !== id));
  }
}
```

## Conclusion

**The simple signal-based implementation is the right choice.**

Creating a model class would be over-engineering that adds:
- More code to maintain
- More API to learn
- More coupling
- Minimal actual benefit

The component does exactly what it should: **display a virtualized scrolling list**.  
Everything else (data fetching, CRUD operations, state management) belongs in the parent component where it can be customized for each use case.

---

*"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."* - Antoine de Saint-Exupéry

