# AlphaPrimeScroller - Quick Reference

## Component API

### Inputs (Signals)
```typescript
model: InputSignal<AlphaPrimeScrollerModel<T> | undefined>
mirror: InputSignal<boolean>              // Default: false
showProgressBar: InputSignal<boolean>     // Default: true
fixedHeight: InputSignal<number>          // Default: -1 (variable)
```

### Outputs (OutputEmitter)
```typescript
scrolled: OutputEmitterRef<number>        // Emits scroll position
allItemsFetched: OutputEmitterRef<boolean> // Emits true when all data loaded
```

### Exposed Signals (for debugging)
```typescript
paddingTop: Signal<number>               // Top spacer height
paddingBottom: Signal<number>            // Bottom spacer height
busy: Signal<boolean>                    // Derived from model.busy
```

---

## Data Feed Function

```typescript
// Your data provider
const feed = (skip: number, take: number): Observable<T[]> => {
  return this.api.getItems(skip, take);
};

// Create model
const model = new AlphaPrimeScrollerModel(feed, pageSize);

// Load initial batch
model.loadItems().subscribe({
  next: (item) => console.log('First item:', item),
  error: (err) => console.error(err)
});
```

---

## Model API

### Properties
```typescript
model.rows: AlphaPrimeScrollerRow<T>[]   // All loaded rows
model.vRows: AlphaPrimeScrollerRow<T>[]  // Visible rows only
model.nbRows: number                      // Total count
model.visibleFrom: number                 // First visible index
model.visibleTo: number                   // Last visible index
model.endReached: boolean                 // All data loaded?
model.busy: boolean                       // Loading?
model.take: number                        // Items per page
```

### Methods
```typescript
// Load
model.loadItems(): Observable<T | undefined>       // Initial load
model.loadNextItems(from: number): Observable<boolean>  // Load more

// Modify
model.appendItem(item: T): void
model.prependItem(item: T): void
model.insertItem(index: number, item: T): void
model.appendItems(items: T[], from: number): void
model.replaceItem(item: T, getId: fn): void
model.removeItem(id: any, getId: fn): T | null
model.removeItems(start: number, count: number): T | null

// Query
model.findItemIndex(val: any, getVal: fn): number
model.slideItems(from: number, to: number): void

// Callbacks
model.onLoading = () => { }                // Called before load
model.onLoaded = (item: T | undefined) => { }  // Called after load
```

---

## Template Usage

### Basic
```html
<alpha-prime-scroller
  [model]="scrollerModel()"
  (scrolled)="onScroll($event)"
  (allItemsFetched)="onComplete()">
  
  <div *ngFor="let row of scrollerModel().vRows; trackBy: trackByFn">
    {{ row.data.name }}
  </div>
</alpha-prime-scroller>
```

### With Fixed Heights
```html
<alpha-prime-scroller
  [model]="scrollerModel()"
  [fixedHeight]="50">
  <!-- Each row is 50px -->
</alpha-prime-scroller>
```

### With Progress Bar
```html
<alpha-prime-scroller
  [model]="scrollerModel()"
  [showProgressBar]="true">
  <!-- Shows loading indicator during fetch -->
</alpha-prime-scroller>
```

### Mirror/RTL
```html
<alpha-prime-scroller
  [model]="scrollerModel()"
  [mirror]="true">
  <!-- For right-to-left layouts -->
</alpha-prime-scroller>
```

---

## TrackBy Function

```typescript
trackByFn(index: number, row: AlphaPrimeScrollerRow<T>): string {
  return row.data.id;  // Or row.id for unique row ID
}
```

---

## Common Patterns

### Refresh List
```typescript
this.scrollerModel().rows = [];
this.scrollerModel().visibleFrom = 0;
this.scrollerModel().visibleTo = 0;
this.scrollerModel().endReached = false;
this.scrollerModel().loadItems().subscribe();
```

### Add Item at Top
```typescript
this.scrollerModel().prependItem(newItem);
```

### Delete Item
```typescript
const deleted = this.scrollerModel().removeItem(id, item => item.id);
```

### Replace Item
```typescript
this.scrollerModel().replaceItem(updatedItem, item => item.id);
```

### Scroll to Top
```typescript
const scrollPanel = document.querySelector('.forwardScrollPanel');
if (scrollPanel) scrollPanel.scrollTop = 0;
```

---

## Performance Tips

1. **Always use trackBy function** - Prevents DOM rebuilds
2. **Use fixed heights** - Faster row analysis
3. **OnPush detection** - Component uses this by default
4. **Pagination size** - Balance between requests and rendering
5. **Debounce scroll events** - If handling onScroll

---

## Debugging

### Check Model State
```typescript
console.log(this.scrollerModel().dims);
// Output: sa: 0 ph: 800 pb:800 ch: 5000 sb:4200 padT:0 padB: 5000 vf:0 vt:10
```

### Monitor Row Positions
```typescript
this.scrollerModel().vRows.forEach(row => {
  console.log(row.dims);
  // Output: p:fullyVisible t:0 b:50 h:50 vh:50 hh:0
});
```

### Log Load Events
```typescript
const model = this.scrollerModel();
model.onLoading = () => console.log('Loading...');
model.onLoaded = (item) => console.log('Loaded:', item);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Padding not resetting | Check if model input is set correctly |
| Rows not visible | Ensure data feed returns items |
| Infinite loading | Check if feed reaches end (items < pageSize) |
| Slow scrolling | Use fixed height and increase page size |
| Items duplicate | Verify trackBy returns unique values |
| Memory leak | Component handles cleanup, check subscriptions |

---

## Browser Support
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅ (vertical scroll only)

---

## Test Files
- `alpha-prime-scroller.spec.ts` - Component tests (3)
- `alpha-prime-scroller-model.spec.ts` - Model tests (11)
- `alpha-prime-scroller-bag.spec.ts` - Analysis tests (9)
- `alpha-prime-scroller-row.spec.ts` - Row tests (7)

**Total: 30 tests - All Passing ✅**

---

## Need Help?

See detailed docs:
- Migration Guide: `SCROLLER_MIGRATION_GUIDE.md`
- Port Summary: `SCROLLER_PORT_SUMMARY.md`
- Demo: `alpha-prime-scroller.demo.ts`

