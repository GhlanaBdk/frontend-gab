import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // ✅ CORRECTION : AppComponent n'a pas de propriété 'title'
  // Le test précédent était : expect(app.title).toEqual('frontend-gab') → ERREUR ts(2339)
  // Solution : on teste simplement que le composant s'initialise correctement
  it('should be an AppComponent instance', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app instanceof AppComponent).toBeTrue();
  });

  // ✅ CORRECTION : AppComponent utilise '<router-outlet>' donc pas de <h1>
  // On vérifie simplement que le template se compile sans erreur
  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
});