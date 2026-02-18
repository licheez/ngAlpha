import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlphaPrimeFilterBoxComponent } from './alpha-prime-filter-box.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeFilterBoxComponent', () => {
  let component: AlphaPrimeFilterBoxComponent;
  let fixture: ComponentFixture<AlphaPrimeFilterBoxComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['generateRandomName']);
    mockPrimeService.generateRandomName.and.returnValue('random-name-123');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeFilterBoxComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.delay()).toBe(300);
      expect(component.showAdd()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.placeholder()).toBe('');
      expect(component.term()).toBeUndefined();
      expect(component.timer).toBeUndefined();
    });

    it('should have output for addClicked', () => {
      expect(component.addClicked).toBeDefined();
      expect(typeof component.addClicked.emit).toBe('function');
    });

    it('should generate a unique name', () => {
      expect(mockPrimeService.generateRandomName).toHaveBeenCalled();
      expect(component.name).toBe('random-name-123');
    });
  });

  describe('Input Properties', () => {
    it('should accept delay input', () => {
      fixture.componentRef.setInput('delay', 500);
      fixture.detectChanges();
      expect(component.delay()).toBe(500);
    });

    it('should accept showAdd input', () => {
      fixture.componentRef.setInput('showAdd', true);
      fixture.detectChanges();
      expect(component.showAdd()).toBe(true);
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should accept placeholder input', () => {
      fixture.componentRef.setInput('placeholder', 'Search...');
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Search...');
    });
  });

  describe('term model', () => {
    it('should support two-way binding', () => {
      fixture.componentRef.setInput('term', 'test-term');
      fixture.detectChanges();
      expect(component.term()).toBe('test-term');
    });

    it('should emit changes when term is set', fakeAsync(() => {
      let emittedValue: string | undefined;
      fixture.componentInstance.term.subscribe((value) => {
        emittedValue = value;
      });

      component.term.set('new-term');
      tick();

      expect(emittedValue).toBe('new-term');
    }));

    it('should support undefined value', () => {
      fixture.componentRef.setInput('term', undefined);
      fixture.detectChanges();
      expect(component.term()).toBeUndefined();
    });
  });

  describe('empty computed signal', () => {
    it('should return true when term is undefined', () => {
      component.term.set(undefined);
      expect(component.empty()).toBe(true);
    });

    it('should return true when term is empty string', () => {
      component.term.set('');
      expect(component.empty()).toBe(true);
    });

    it('should return true when term is only whitespace', () => {
      component.term.set('   ');
      expect(component.empty()).toBe(true);
    });

    it('should return false when term has content', () => {
      component.term.set('search');
      expect(component.empty()).toBe(false);
    });

    it('should return false when term has content with spaces', () => {
      component.term.set(' search term ');
      expect(component.empty()).toBe(false);
    });
  });

  describe('onTermChanged method', () => {
    it('should stop existing timer before starting new one', fakeAsync(() => {
      component.onTermChanged('first');
      expect(component.timer).toBeDefined();

      const firstTimer = component.timer;

      component.onTermChanged('second');

      expect(component.timer).toBeDefined();
      expect(component.timer).not.toBe(firstTimer);
    }));

    it('should set term after delay', fakeAsync(() => {
      fixture.componentRef.setInput('delay', 300);

      component.onTermChanged('test');

      expect(component.term()).toBeUndefined();

      tick(299);
      expect(component.term()).toBeUndefined();

      tick(1);
      expect(component.term()).toBe('test');
    }));

    it('should respect custom delay', fakeAsync(() => {
      fixture.componentRef.setInput('delay', 500);

      component.onTermChanged('test');

      tick(499);
      expect(component.term()).toBeUndefined();

      tick(1);
      expect(component.term()).toBe('test');
    }));

    it('should update term with new value', fakeAsync(() => {
      component.term.set('old');

      component.onTermChanged('new');
      tick(300);

      expect(component.term()).toBe('new');
    }));

    it('should cancel previous timer when called again', fakeAsync(() => {
      component.onTermChanged('first');
      tick(100);

      component.onTermChanged('second');
      tick(300);

      expect(component.term()).toBe('second');
    }));
  });

  describe('onClear method', () => {
    it('should set term to undefined', () => {
      component.term.set('test');

      component.onClear();

      expect(component.term()).toBeUndefined();
    });

    it('should stop timer if set', fakeAsync(() => {
      component.onTermChanged('test');
      expect(component.timer).toBeDefined();

      component.onClear();

      expect(component.timer).toBeUndefined();
    }));

    it('should emit termChange with undefined', fakeAsync(() => {
      let emittedValue: string | undefined = 'initial';
      component.term.subscribe((value) => {
        emittedValue = value;
      });

      component.term.set('test');
      tick();

      component.onClear();
      tick();

      expect(emittedValue).toBeUndefined();
    }));

    it('should not throw error if timer is not set', () => {
      expect(() => component.onClear()).not.toThrow();
    });
  });

  describe('onAddClicked method', () => {
    it('should emit addClicked event with current term', () => {
      spyOn(component.addClicked, 'emit');
      component.term.set('test-term');

      component.onAddClicked();

      expect(component.addClicked.emit).toHaveBeenCalledWith('test-term');
    });

    it('should emit addClicked event with undefined when term is empty', () => {
      spyOn(component.addClicked, 'emit');
      component.term.set(undefined);

      component.onAddClicked();

      expect(component.addClicked.emit).toHaveBeenCalledWith(undefined);
    });

    it('should stop timer before emitting', fakeAsync(() => {
      component.onTermChanged('test');
      expect(component.timer).toBeDefined();

      component.onAddClicked();

      expect(component.timer).toBeUndefined();
    }));

    it('should emit immediately without delay', fakeAsync(() => {
      spyOn(component.addClicked, 'emit');
      component.term.set('test');

      component.onAddClicked();

      expect(component.addClicked.emit).toHaveBeenCalledWith('test');
      expect(component.addClicked.emit).toHaveBeenCalledTimes(1);
    }));
  });

  describe('stopTimerIfSet method', () => {
    it('should clear timer if set', fakeAsync(() => {
      component.onTermChanged('test');
      expect(component.timer).toBeDefined();

      component['stopTimerIfSet']();

      expect(component.timer).toBeUndefined();
    }));

    it('should not throw error if timer is undefined', () => {
      component.timer = undefined;

      expect(() => component['stopTimerIfSet']()).not.toThrow();
    });

    it('should prevent delayed term update after clearing', fakeAsync(() => {
      component.onTermChanged('test');

      component['stopTimerIfSet']();
      tick(300);

      expect(component.term()).toBeUndefined();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should clear timer on destroy', fakeAsync(() => {
      component.onTermChanged('test');
      expect(component.timer).toBeDefined();

      component.ngOnDestroy();

      expect(component.timer).toBeUndefined();
    }));

    it('should not throw error if timer is not set', () => {
      component.timer = undefined;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should prevent memory leaks by clearing timer', fakeAsync(() => {
      component.onTermChanged('test');

      component.ngOnDestroy();
      tick(300);

      // Timer should not execute after destroy
      expect(component.term()).toBeUndefined();
    }));
  });

  describe('Template Integration', () => {
    it('should render input group', () => {
      const inputGroup = fixture.debugElement.query(By.css('p-inputgroup'));
      expect(inputGroup).toBeTruthy();
    });

    it('should render text input', () => {
      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input).toBeTruthy();
    });

    it('should bind placeholder to input', fakeAsync(() => {
      fixture.componentRef.setInput('placeholder', 'Search items...');
      fixture.detectChanges();
      tick();

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input.nativeElement.placeholder).toBe('Search items...');
    }));

    it('should disable input when disabled is true', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      tick();

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input.nativeElement.disabled).toBe(true);
    }));

    it('should enable input when disabled is false', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      tick();

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input.nativeElement.disabled).toBe(false);
    }));

    it('should show clear button when term is not empty', () => {
      component.term.set('test');
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const clearButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-times')
      );
      expect(clearButton).toBeTruthy();
    });

    it('should not show clear button when term is empty', () => {
      component.term.set(undefined);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const clearButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-times')
      );
      expect(clearButton).toBeFalsy();
    });

    it('should show add button when showAdd is true', () => {
      fixture.componentRef.setInput('showAdd', true);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const addButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-plus')
      );
      expect(addButton).toBeTruthy();
    });

    it('should not show add button when showAdd is false', () => {
      fixture.componentRef.setInput('showAdd', false);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const addButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-plus')
      );
      expect(addButton).toBeFalsy();
    });

    it('should call onTermChanged when input value changes', fakeAsync(() => {
      spyOn(component, 'onTermChanged');
      const input = fixture.debugElement.query(By.css('input[type="text"]'));

      input.nativeElement.value = 'test';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      expect(component.onTermChanged).toHaveBeenCalled();
    }));

    it('should call onClear when clear button is clicked', () => {
      spyOn(component, 'onClear');
      component.term.set('test');
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const clearButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-times')
      );

      clearButton?.triggerEventHandler('onClick', null);

      expect(component.onClear).toHaveBeenCalled();
    });

    it('should call onAddClicked when add button is clicked', () => {
      spyOn(component, 'onAddClicked');
      fixture.componentRef.setInput('showAdd', true);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const addButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-plus')
      );

      addButton?.triggerEventHandler('onClick', null);

      expect(component.onAddClicked).toHaveBeenCalled();
    });

    it('should use unique name for input', fakeAsync(() => {
      // Ensure component.name is set
      expect(component.name).toBe('random-name-123');

      fixture.detectChanges();
      tick();
      fixture.detectChanges(); // Extra change detection

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input).toBeTruthy();

      // Check both the DOM property and attribute
      const nameValue = input.nativeElement.getAttribute('name') || input.nativeElement.name;
      expect(nameValue).toBe('random-name-123');
    }));

    it('should disable all buttons when disabled is true', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('showAdd', true);
      component.term.set('test');
      fixture.detectChanges();
      tick();

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      buttons.forEach(btn => {
        expect(btn.nativeElement.disabled).toBe(true);
      });
    }));
  });

  describe('Two-Way Binding Integration', () => {
    it('should support two-way binding pattern', fakeAsync(() => {
      let parentTerm: string | undefined;

      // Simulate parent component binding
      component.term.subscribe((value) => {
        parentTerm = value;
      });

      // Simulate user typing
      component.onTermChanged('search term');
      tick(300);

      expect(parentTerm).toBe('search term');
    }));

    it('should update when parent changes term', () => {
      fixture.componentRef.setInput('term', 'parent-value');
      fixture.detectChanges();

      expect(component.term()).toBe('parent-value');
    });

    it('should emit changes to parent with delay', fakeAsync(() => {
      let parentTerm: string | undefined = 'initial';
      component.term.subscribe((value) => {
        parentTerm = value;
      });

      component.onTermChanged('new-value');
      expect(parentTerm).toBe('initial'); // Not changed yet

      tick(300);
      expect(parentTerm).toBe('new-value'); // Changed after delay
    }));

    it('should emit undefined when cleared', fakeAsync(() => {
      let parentTerm: string | undefined = 'test';
      component.term.subscribe((value) => {
        parentTerm = value;
      });

      component.term.set('test');
      tick();

      component.onClear();
      tick();

      expect(parentTerm).toBeUndefined();
    }));
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive term changes', fakeAsync(() => {
      component.onTermChanged('first');
      tick(100);

      component.onTermChanged('second');
      tick(100);

      component.onTermChanged('third');
      tick(300);

      expect(component.term()).toBe('third');
    }));

    it('should handle empty string term', fakeAsync(() => {
      component.onTermChanged('');
      tick(300);

      expect(component.term()).toBe('');
      expect(component.empty()).toBe(true);
    }));

    it('should handle whitespace term', fakeAsync(() => {
      component.onTermChanged('   ');
      tick(300);

      expect(component.term()).toBe('   ');
      expect(component.empty()).toBe(true);
    }));

    it('should handle very long delay', fakeAsync(() => {
      fixture.componentRef.setInput('delay', 5000);

      component.onTermChanged('test');
      tick(4999);
      expect(component.term()).toBeUndefined();

      tick(1);
      expect(component.term()).toBe('test');
    }));

    it('should handle zero delay', fakeAsync(() => {
      fixture.componentRef.setInput('delay', 0);

      component.onTermChanged('test');
      tick();

      expect(component.term()).toBe('test');
    }));
  });
});
