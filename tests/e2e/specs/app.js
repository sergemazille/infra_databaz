describe('App', () => {
  it('Sanity test', () => {
    cy.visit('/');
    cy.contains('h1', 'Databaz');
  });
});
