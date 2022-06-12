describe('class instances as form value', () => {
  it('form should add colors after submit', () => {
    cy.visit('http://localhost:3000/classInstancesAsValues');

    cy.get('[data-cy="fancy-color-picker-item"]').should('have.length', 8);
    cy.get(
      '[data-cy="fancy-color-picker-item"][data-cy-color="White"]',
    ).click();
    cy.get(
      '[data-cy="fancy-color-picker-item"][data-cy-color="Black"]',
    ).click();
    cy.get('button[role="submit"]').click();

    cy.get(
      '[data-cy="fancy-color-picker-item"][data-cy-color="CadetBlue"]',
    ).click();
    cy.get('button[role="submit"]').click();

    cy.get('[data-cy="fancy-color-tile"]').should('have.length', 2);
  });
});
