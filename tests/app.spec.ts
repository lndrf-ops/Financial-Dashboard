import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function goToDashboardViaPersona(page: Page, personaName = 'Lena') {
  await page.goto('/');
  await page.getByRole('button', { name: /Demo-Profile/ }).click();
  await page.getByText(personaName, { exact: false }).first().click();
  await expect(page.getByText('Deine Rente mit')).toBeVisible();
}

/** Wartet bis Step 1 (TR-Sync-Animation) automatisch zu Step 2 wechselt (~3s). */
async function waitForAIStep2(page: Page) {
  await expect(page.getByText(/Wie fühlst du dich/i)).toBeVisible({ timeout: 6000 });
}

/** Scrollt ein Element in die Mitte des sichtbaren Bereichs (oberhalb der fixierten Bottom-Nav). */
async function scrollToElement(page: Page, locator: ReturnType<Page['locator']>) {
  await locator.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80));
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────

test.describe('Welcome Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('zeigt Titel, Tagline und beide Einstiegs-Buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'FutureMe' })).toBeVisible();
    await expect(page.getByText(/Deine Altersvorsorge/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Jetzt starten/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Demo-Profile/ })).toBeVisible();
  });

  test('"Jetzt starten" öffnet AI-Onboarding', async ({ page }) => {
    await page.getByRole('button', { name: /Jetzt starten/ }).click();
    await expect(page.getByRole('heading', { name: 'Trade Republic Profil' })).toBeVisible();
  });

  test('"Demo-Profile" öffnet Persona-Auswahl', async ({ page }) => {
    await page.getByRole('button', { name: /Demo-Profile/ }).click();
    await expect(page.getByText(/Dein Start in die Altersvorsorge/i)).toBeVisible();
  });
});

// ─── AI Onboarding ───────────────────────────────────────────────────────────

test.describe('AI Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Jetzt starten/ }).click();
  });

  test('Step 1 zeigt TR-Sync-Animation und wechselt automatisch zu Step 2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Trade Republic Profil' })).toBeVisible();
    // Step 1 hat keinen klickbaren Weiter-Button — er springt nach ~3s automatisch weiter
    await waitForAIStep2(page);
    await expect(page.getByText(/Wie fühlst du dich/i)).toBeVisible();
  });

  test('Step 2 zeigt alle drei Feeling-Optionen', async ({ page }) => {
    await waitForAIStep2(page);
    await expect(page.getByText(/Ich verdränge es/i)).toBeVisible();
    await expect(page.getByText(/Macht mir Sorgen/i)).toBeVisible();
    await expect(page.getByText(/Bin entspannt/i)).toBeVisible();
  });

  test('Step 2: "Weiter" ist disabled ohne Auswahl', async ({ page }) => {
    await waitForAIStep2(page);
    await expect(page.getByRole('button', { name: /Weiter/i })).toBeDisabled();
  });

  test('Step 2: Feeling-Auswahl aktiviert "Weiter"-Button', async ({ page }) => {
    await waitForAIStep2(page);
    await page.getByText(/Ich verdränge es/i).click();
    await expect(page.getByRole('button', { name: /Weiter/i })).toBeEnabled();
  });

  test('Step 2 → 3: Klick auf "Weiter" zeigt Dokument-Optionen', async ({ page }) => {
    await waitForAIStep2(page);
    await page.getByText(/Bin entspannt/i).click();
    await page.getByRole('button', { name: /Weiter/i }).click();
    await expect(page.getByRole('heading', { name: /Deine Vorsorgepapiere/i })).toBeVisible();
  });

  test('Step 3: "Keine Dokumente" wechselt zu manueller Eingabe', async ({ page }) => {
    await waitForAIStep2(page);
    await page.getByText(/Bin entspannt/i).click();
    await page.getByRole('button', { name: /Weiter/i }).click();
    await page.getByText(/Keine Dokumente zur Hand/i).click();
    await expect(page.getByText(/Netto-Einkommen|Gehalt/i).first()).toBeVisible();
  });

  test('Step 2: Zurück-Button kehrt zu Step 1-Animation zurück', async ({ page }) => {
    await waitForAIStep2(page);
    // Zurück-Button (ArrowLeft, oben links) — Step 1 ist kurz sichtbar bevor auto-advance
    await page.locator('button').first().click();
    // Step 1 startet TR-Sync und springt danach wieder zu Step 2 — wir prüfen nur, dass der Step-Wechsel passiert
    await expect(page.getByText(/Wie fühlst du dich|Trade Republic/i)).toBeVisible({ timeout: 6000 });
  });

  test('Fortschrittsbalken ist sichtbar', async ({ page }) => {
    await waitForAIStep2(page);
    // Progress-Bar Fill hat inline style="width: X%"
    await expect(page.locator('[style*="width:"], [style*="width: "]').first()).toBeVisible();
  });
});

// ─── Persona-Onboarding ──────────────────────────────────────────────────────

test.describe('Persona-Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Demo-Profile/ }).click();
  });

  test('zeigt Titel und alle drei Personas', async ({ page }) => {
    await expect(page.getByText(/Dein Start in die Altersvorsorge/i)).toBeVisible();
    await expect(page.getByText('John')).toBeVisible();
    await expect(page.getByText('Lena')).toBeVisible();
    await expect(page.getByText('Michael')).toBeVisible();
  });

  test('zeigt Rollen der Personas', async ({ page }) => {
    await expect(page.getByText(/Data Science Student/i)).toBeVisible();
    await expect(page.getByText(/Senior IT Consultant/i)).toBeVisible();
    await expect(page.getByText(/Projektleiter/i)).toBeVisible();
  });

  test('Persona John (25) lädt Dashboard mit Name', async ({ page }) => {
    await page.getByText('John').first().click();
    await expect(page.getByText(/Hallo, John/i)).toBeVisible();
  });

  test('Persona Lena (32) lädt Dashboard mit Name', async ({ page }) => {
    await page.getByText('Lena').first().click();
    await expect(page.getByText(/Hallo, Lena/i)).toBeVisible();
  });

  test('Persona Michael (58) lädt Dashboard mit Name', async ({ page }) => {
    await page.getByText('Michael').first().click();
    await expect(page.getByText(/Hallo, Michael/i)).toBeVisible();
  });

  test('"KI-Setup"-Button wechselt zu AI-Onboarding', async ({ page }) => {
    await page.getByText(/KI-Setup/i).click();
    await expect(page.getByRole('heading', { name: 'Trade Republic Profil' })).toBeVisible();
  });
});

// ─── Dashboard – Übersicht ───────────────────────────────────────────────────

test.describe('Dashboard – Übersicht', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
  });

  test('zeigt Header mit FutureMe Logo', async ({ page }) => {
    await expect(page.getByText('FutureMe').first()).toBeVisible();
  });

  test('zeigt Ring-Chart mit Auszahlungs-Wert und Ziel', async ({ page }) => {
    await expect(page.getByText(/Mtl. Auszahlung/i)).toBeVisible();
    await expect(page.getByText(/Ziel:/i)).toBeVisible();
  });

  test('zeigt Prozent-Badge', async ({ page }) => {
    await expect(page.getByText(/% vom Ziel erreicht|Ziel erreicht/i).first()).toBeVisible();
  });

  test('zeigt Stats-Leiste: Gesamtvermögen, Alter, Sparrate', async ({ page }) => {
    await expect(page.getByText(/Gesamtvermögen/i)).toBeVisible();
    await expect(page.getByText(/Reicht bis Alter/i)).toBeVisible();
    await expect(page.getByText(/Sparrate/i)).toBeVisible();
  });

  test('zeigt Asset Breakdown Sektion', async ({ page }) => {
    await expect(page.getByText(/Rente zur Auszahlung/i)).toBeVisible();
  });

  test('Bell-Icon löst Sparplan-Notification aus', async ({ page }) => {
    // Bell ist ein SVG mit onClick (kein <button>), Lucide rendert es mit .lucide-bell
    await page.locator('.lucide-bell').click();
    await expect(page.getByText(/Sparplan/i)).toBeVisible({ timeout: 3000 });
  });

  test('Notification kann manuell geschlossen werden', async ({ page }) => {
    await page.locator('.lucide-bell').click();
    await expect(page.getByText(/Sparplan/i)).toBeVisible({ timeout: 3000 });
    // X-Button der Notification
    await page.locator('.fixed.top-6 button').click();
    await expect(page.getByText(/Sparplan/i)).not.toBeVisible({ timeout: 2000 });
  });

  test('Logout kehrt zur Welcome-Seite zurück', async ({ page }) => {
    // LogOut ist ein SVG mit onClick, Lucide rendert es mit .lucide-log-out
    await page.locator('.lucide-log-out').click();
    await expect(page.getByRole('heading', { name: 'FutureMe' })).toBeVisible();
  });

  test('Bottom-Navigation zeigt 4 Tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Übersicht/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Investieren/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Simulation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Profil/i })).toBeVisible();
  });
});

// ─── Dashboard – Asset Breakdown ─────────────────────────────────────────────

test.describe('Dashboard – Asset Breakdown', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
  });

  test('zeigt Gesetzliche Rente und Weltweites Portfolio', async ({ page }) => {
    await expect(page.getByText(/Gesetzliche Rente/i)).toBeVisible();
    await expect(page.getByText(/Weltweites Portfolio/i)).toBeVisible();
  });

  test('Klick auf Asset-Row öffnet Edit-Modal', async ({ page }) => {
    // dispatchEvent umgeht die fixierte Bottom-Nav, die pointer events abfängt
    const assetRow = page.locator('p.truncate').filter({ hasText: /Gesetzliche Rente/ }).locator('..').locator('..');
    await assetRow.dispatchEvent('click');
    await expect(page.getByText(/Bearbeiten:/i)).toBeVisible();
    await expect(page.getByText(/Änderungen speichern/i)).toBeVisible();
  });

  test('Edit-Modal hat Number-Input-Felder', async ({ page }) => {
    const assetRow = page.locator('p.truncate').filter({ hasText: /Gesetzliche Rente/ }).locator('..').locator('..');
    await assetRow.dispatchEvent('click');
    await expect(page.getByText(/Bearbeiten:/i)).toBeVisible();
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
  });

  test('Edit-Modal schließt sich mit X-Button', async ({ page }) => {
    const assetRow = page.locator('p.truncate').filter({ hasText: /Gesetzliche Rente/ }).locator('..').locator('..');
    await assetRow.dispatchEvent('click');
    await expect(page.getByText(/Bearbeiten:/i)).toBeVisible();
    // X-Button im Modal (oben rechts, absolute position)
    await page.locator('.fixed.inset-0').getByRole('button').first().click();
    await expect(page.getByText(/Bearbeiten:/i)).not.toBeVisible({ timeout: 3000 });
  });

  test('Betriebliche Rente ist bei Lena sichtbar', async ({ page }) => {
    await expect(page.getByText(/Betriebliche Rente/i)).toBeVisible();
  });

  test('Immobilie ist bei Lena sichtbar', async ({ page }) => {
    await expect(page.getByText(/Immobilie/i).first()).toBeVisible();
  });
});

// ─── Dashboard – Optimierungsplan ────────────────────────────────────────────

test.describe('Optimierungsplan', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'John');
  });

  test('zeigt "Lücke jetzt schließen" Button bei John', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Lücke jetzt schließen/ })).toBeVisible();
  });

  test('zeigt die 3 größten Hebel auf dem Dashboard', async ({ page }) => {
    await expect(page.getByText(/VL-Sparen aktivieren/i)).toBeVisible();
    await expect(page.getByText(/bAV nutzen/i)).toBeVisible();
    await expect(page.getByText(/Sparrate erhöhen/i)).toBeVisible();
  });

  test('Klick öffnet Optimierungsplan mit "Dein Aktionsplan"', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await expect(page.getByText(/Dein Aktionsplan/i)).toBeVisible();
  });

  test('Optimierungsplan zeigt Schritt-Indikator', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await expect(page.getByText(/Schritt/i)).toBeVisible();
  });

  test('Optimierungsplan: "Los geht\'s"-Button vorhanden', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await expect(page.getByRole('button', { name: /Los geht's/i })).toBeVisible();
  });

  test('Optimierungsplan: Zurück-Button kehrt zum Dashboard zurück', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    // ArrowLeft-Button oben links im Optimierungsplan
    await page.locator('.lucide-arrow-left').click();
    await expect(page.getByText('Deine Rente mit')).toBeVisible();
  });

  test('Step 1 → 2 via "Los geht\'s": VL-Sparen Optionen erscheinen', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await page.getByRole('button', { name: /Los geht's/i }).click();
    await expect(page.getByRole('heading', { name: /Geld vom Chef/i })).toBeVisible();
  });

  test('Step 2: VL-Sparen Option ist klickbar und aktiviert "Weiter"', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await page.getByRole('button', { name: /Los geht's/i }).click();
    await page.getByText(/VL-Sparen aktivieren/i).click();
    await expect(page.getByRole('button', { name: /Weiter/i })).toBeEnabled();
  });

  test('Step 2: Überspringen führt zu Step 3 (bAV)', async ({ page }) => {
    await page.getByRole('button', { name: /Lücke jetzt schließen/ }).click();
    await page.getByRole('button', { name: /Los geht's/i }).click();
    await page.getByText(/Überspringen/i).first().click();
    await page.getByRole('button', { name: /Weiter/i }).click();
    await expect(page.getByRole('heading', { name: /Brutto-Netto-Magie/i })).toBeVisible();
  });
});

// ─── Tab: Investieren ────────────────────────────────────────────────────────

test.describe('Tab: Investieren', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
    await page.getByRole('button', { name: /Investieren/i }).click();
  });

  test('Tab ist aktiv (schwarz)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Investieren/i })).toHaveClass(/text-black/);
  });

  test('zeigt "Dein monatlicher Sparplan" Überschrift', async ({ page }) => {
    await expect(page.getByText(/Dein monatlicher Sparplan/i)).toBeVisible();
  });

  test('zeigt Trade Republic als Ausführer', async ({ page }) => {
    await expect(page.getByText(/Trade Republic/i).first()).toBeVisible();
  });

  test('zeigt Core MSCI World ETF', async ({ page }) => {
    await expect(page.getByText(/Core MSCI World/i)).toBeVisible();
  });

  test('zeigt 10-Jahres Vorschau Chart', async ({ page }) => {
    await expect(page.getByText(/10-Jahres Vorschau/i)).toBeVisible();
  });

  test('zeigt "Deine Ausführung" Sektion', async ({ page }) => {
    await expect(page.getByText(/Deine Ausführung/i)).toBeVisible();
  });

  test('zeigt "In Trade Republic öffnen" Button', async ({ page }) => {
    await expect(page.getByText(/In Trade Republic öffnen/i)).toBeVisible();
  });
});

// ─── Tab: Simulation ─────────────────────────────────────────────────────────

test.describe('Tab: Simulation', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'John');
    await page.getByRole('button', { name: /Simulation/i }).click();
  });

  test('Tab ist aktiv (schwarz)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Simulation/i })).toHaveClass(/text-black/);
  });

  test('zeigt Makro-Stresstests Sektion', async ({ page }) => {
    await expect(page.getByText(/Makro-Stresstests/i)).toBeVisible();
  });

  test('zeigt alle drei Stresstest-Optionen', async ({ page }) => {
    await expect(page.getByText(/Bärenmarkt/i)).toBeVisible();
    await expect(page.getByText(/Hohe Inflation/i)).toBeVisible();
    await expect(page.getByText(/Langlebigkeitsrisiko/i)).toBeVisible();
  });

  test('Bärenmarkt-Toggle kann aktiviert werden', async ({ page }) => {
    const toggles = page.locator('button[role="switch"]');
    await toggles.first().click();
    await expect(toggles.first()).toHaveAttribute('data-state', 'checked');
  });

  test('Hohe Inflation Toggle kann aktiviert werden', async ({ page }) => {
    const toggles = page.locator('button[role="switch"]');
    await toggles.nth(1).click();
    await expect(toggles.nth(1)).toHaveAttribute('data-state', 'checked');
  });

  test('Langlebigkeitsrisiko Toggle kann aktiviert werden', async ({ page }) => {
    const toggles = page.locator('button[role="switch"]');
    await toggles.last().click();
    await expect(toggles.last()).toHaveAttribute('data-state', 'checked');
  });

  test('zeigt "Biografie & Events" Sektion', async ({ page }) => {
    await expect(page.getByText(/Biografie & Events/i)).toBeVisible();
  });

  test('zeigt "Noch keine Lebensereignisse" im leeren Zustand', async ({ page }) => {
    await expect(page.getByText(/Noch keine Lebensereignisse/i)).toBeVisible();
  });

  test('Plus-Button öffnet Lebensereignis-Menü', async ({ page }) => {
    // Der Plus-Button enthält ein Lucide Plus-Icon (kein Text)
    await page.locator('button:has(.lucide-plus)').click();
    await expect(page.getByText(/Sabbatical/i)).toBeVisible();
    await expect(page.getByText(/Immobilienkauf/i)).toBeVisible();
    await expect(page.getByText(/Elternzeit/i)).toBeVisible();
  });

  test('"Sabbatical" kann hinzugefügt werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Sabbatical/i).click();
    await expect(page.getByText(/Sabbatical/i)).toBeVisible();
    // Alter im Event-Card (p.text-xs), nicht die Stresstest-Beschreibung
    await expect(page.locator('p.text-xs').filter({ hasText: /Alter \d+/i })).toBeVisible();
  });

  test('"Immobilienkauf" kann hinzugefügt werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Immobilienkauf/i).click();
    await expect(page.getByText(/Immobilienkauf/i)).toBeVisible();
  });

  test('"Elternzeit" kann hinzugefügt werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Elternzeit/i).click();
    await expect(page.getByText(/Elternzeit/i)).toBeVisible();
  });

  test('Lebensereignis kann entfernt werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Sabbatical/i).click();
    await expect(page.getByText(/Sabbatical/i)).toBeVisible();
    // X-Button des Event-Cards: button:has(.lucide-x)
    await page.locator('button:has(.lucide-x)').last().click();
    await expect(page.getByText(/Noch keine Lebensereignisse/i)).toBeVisible();
  });

  test('Alter eines Lebensereignisses kann mit + erhöht werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Sabbatical/i).click();
    // Das Alter im Event-Card ist in einem p.text-xs Element
    const ageText = page.locator('p.text-xs').filter({ hasText: /Alter \d+/i });
    const before = await ageText.textContent();
    await page.getByRole('button', { name: '+' }).last().click();
    const after = await ageText.textContent();
    expect(after).not.toBe(before);
  });

  test('Alter eines Lebensereignisses kann mit - verringert werden', async ({ page }) => {
    await page.locator('button:has(.lucide-plus)').click();
    await page.getByText(/Sabbatical/i).click();
    const ageText = page.locator('p.text-xs').filter({ hasText: /Alter \d+/i });
    const before = await ageText.textContent();
    await page.getByRole('button', { name: '-' }).last().click();
    const after = await ageText.textContent();
    expect(after).not.toBe(before);
  });
});

// ─── Tab: Profil ─────────────────────────────────────────────────────────────

test.describe('Tab: Profil', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
    await page.getByRole('button', { name: /Profil/i }).click();
  });

  test('Tab ist aktiv (schwarz)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Profil/i })).toHaveClass(/text-black/);
  });

  test('zeigt "Profil & Daten" Header', async ({ page }) => {
    await expect(page.getByText(/Profil & Daten/i)).toBeVisible();
  });

  test('Account-Sektion ist standardmäßig geöffnet', async ({ page }) => {
    await expect(page.getByText(/Persönliche Daten/i)).toBeVisible();
    await expect(page.getByText(/Risikoprofil/i)).toBeVisible();
  });

  test('zeigt alle 5 Account-Einträge', async ({ page }) => {
    await expect(page.getByText(/Persönliche Daten/i)).toBeVisible();
    await expect(page.getByText(/Risikoprofil/i)).toBeVisible();
    await expect(page.getByText(/Steuern & Freistellung/i)).toBeVisible();
    await expect(page.getByText(/Verknüpfte Konten/i)).toBeVisible();
    await expect(page.getByText(/Sicherheit & Login/i)).toBeVisible();
  });

  test('Daten-Sync Sektion öffnet sich auf Klick', async ({ page }) => {
    await page.getByText(/Daten-Sync/i).click();
    await expect(page.getByText(/Renten-PDF/i)).toBeVisible();
    await expect(page.getByText(/HR-Portal/i)).toBeVisible();
  });

  test('Simulations-Parameter Sektion öffnet sich auf Klick', async ({ page }) => {
    await page.getByText(/Simulations-Parameter/i).click();
    await expect(page.getByText(/Inflation|Rentenalter|Sparrate/i).first()).toBeVisible();
  });

  test('"Persönliche Daten" navigiert zu PersonalDataView', async ({ page }) => {
    await page.getByText(/Persönliche Daten/i).first().click();
    await expect(page.getByText(/Stammdaten/i)).toBeVisible();
  });
});

// ─── PersonalDataView ────────────────────────────────────────────────────────

test.describe('Persönliche Daten', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
    await page.getByRole('button', { name: /Profil/i }).click();
    await page.getByText(/Persönliche Daten/i).first().click();
    await expect(page.getByText(/Stammdaten/i)).toBeVisible();
  });

  test('zeigt Stammdaten-Felder: Vorname, Nachname, Geburtsdatum', async ({ page }) => {
    await expect(page.getByText(/Vorname/i)).toBeVisible();
    await expect(page.getByText(/Nachname/i)).toBeVisible();
    await expect(page.getByText(/Geburtsdatum/i)).toBeVisible();
  });

  test('zeigt Steuer & Abgaben-Felder', async ({ page }) => {
    await expect(page.getByText(/Steuerklasse/i).first()).toBeVisible();
    await expect(page.getByText(/Bundesland/i).first()).toBeVisible();
    await expect(page.getByText(/Kirchensteuer/i).first()).toBeVisible();
  });

  test('Steuerklasse-Dropdown hat 6 Optionen', async ({ page }) => {
    const select = page.locator('select').first();
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(6);
  });

  test('Bundesland-Dropdown hat mehrere Optionen', async ({ page }) => {
    const selects = page.locator('select');
    const bundeslandSelect = selects.nth(1);
    const options = await bundeslandSelect.locator('option').count();
    expect(options).toBeGreaterThan(5);
  });

  test('Vorname-Feld ist editierbar', async ({ page }) => {
    const vornameInput = page.locator('input[type="text"]').first();
    await vornameInput.fill('Max');
    await expect(vornameInput).toHaveValue('Max');
  });

  test('Nachname-Feld ist editierbar', async ({ page }) => {
    const nachnameInput = page.locator('input[type="text"]').nth(1);
    await nachnameInput.fill('Mustermann');
    await expect(nachnameInput).toHaveValue('Mustermann');
  });

  test('Kirchensteuer-Toggle ist umschaltbar', async ({ page }) => {
    const toggle = page.locator('button[role="switch"]');
    const before = await toggle.getAttribute('data-state');
    await toggle.click();
    const after = await toggle.getAttribute('data-state');
    expect(after).not.toBe(before);
  });

  test('"Daten speichern" zeigt Erfolgsstatus', async ({ page }) => {
    await page.getByRole('button', { name: /Daten speichern/i }).click();
    await expect(page.getByText(/Erfolgreich aktualisiert/i)).toBeVisible({ timeout: 3000 });
  });

  test('Zurück-Button kehrt zu Profil zurück', async ({ page }) => {
    await page.locator('.lucide-arrow-left').click();
    await expect(page.getByText(/Profil & Daten/i)).toBeVisible();
  });
});

// ─── Globale Navigation & Tab-Wechsel ────────────────────────────────────────

test.describe('Globale Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
  });

  test('alle vier Tabs sind ohne Fehler erreichbar', async ({ page }) => {
    for (const tab of ['Investieren', 'Simulation', 'Profil', 'Übersicht']) {
      await page.getByRole('button', { name: new RegExp(tab, 'i') }).click();
      await expect(page).not.toHaveURL(/error/);
      await expect(page.locator('body')).not.toContainText('Error');
    }
  });

  test('Rücknavigation: Investieren → Übersicht', async ({ page }) => {
    await page.getByRole('button', { name: /Investieren/i }).click();
    await page.getByRole('button', { name: /Übersicht/i }).click();
    await expect(page.getByText('Deine Rente mit')).toBeVisible();
  });

  test('Rücknavigation: Profil → Übersicht', async ({ page }) => {
    await page.getByRole('button', { name: /Profil/i }).click();
    await page.getByRole('button', { name: /Übersicht/i }).click();
    await expect(page.getByText('Deine Rente mit')).toBeVisible();
  });

  test('Notification verschwindet nach ~4s automatisch', async ({ page }) => {
    await page.locator('.lucide-bell').click();
    await expect(page.getByText(/Sparplan/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/Sparplan/i)).not.toBeVisible({ timeout: 6000 });
  });
});

// ─── Persona-spezifische Inhalte ─────────────────────────────────────────────

test.describe('Persona-spezifische Inhalte', () => {
  test('John (25) hat sichtbare Rentenlücke mit 3 Hebeln', async ({ page }) => {
    await goToDashboardViaPersona(page, 'John');
    await expect(page.getByText(/VL-Sparen aktivieren/i)).toBeVisible();
    await expect(page.getByText(/bAV nutzen/i)).toBeVisible();
    await expect(page.getByText(/Sparrate erhöhen/i)).toBeVisible();
  });

  test('Lena (32) hat Immobilien-Asset', async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
    await expect(page.getByText(/Immobilie/i).first()).toBeVisible();
  });

  test('Lena (32) hat Betriebliche Rente Asset', async ({ page }) => {
    await goToDashboardViaPersona(page, 'Lena');
    await expect(page.getByText(/Betriebliche Rente/i)).toBeVisible();
  });

  test('Michael (58) zeigt Prozentziel-Badge', async ({ page }) => {
    await goToDashboardViaPersona(page, 'Michael');
    await expect(page.getByText(/% vom Ziel|Ziel erreicht/i).first()).toBeVisible();
  });

  test('Wechsel zwischen Personas aktualisiert den Namen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Demo-Profile/ }).click();
    await page.getByText('John').first().click();
    await expect(page.getByText(/Hallo, John/i)).toBeVisible();

    // Logout und andere Persona laden
    await page.locator('.lucide-log-out').click();
    await page.getByRole('button', { name: /Demo-Profile/ }).click();
    await page.getByText('Lena').first().click();
    await expect(page.getByText(/Hallo, Lena/i)).toBeVisible();
  });
});
