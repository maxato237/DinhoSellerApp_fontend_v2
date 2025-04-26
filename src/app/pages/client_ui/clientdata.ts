export const Clientdata: any[] = Array.from({ length: 300 }, (_, i) => ({
  code: 1000 + i,
  name: `Client ${i + 1}`,
  type: ['Individual', 'Company'][Math.floor(Math.random() * 2)],
  group: Math.ceil(Math.random() * 10),
  principle_address: `Street ${Math.ceil(Math.random() * 100)}, City ${Math.ceil(Math.random() * 50)}`,
  email: `client${i + 1}@example.com`,
  phone: Math.floor(600000000 + Math.random() * 399999999), // Numéro de téléphone fictif
  specific_price: `${(Math.random() * (5000 - 500) + 500).toFixed(2)} FCFA`,
  payement_requirement: ['Prepaid', 'Net 30', 'Net 60'][Math.floor(Math.random() * 3)],
  facturation_address: `Billing Street ${Math.ceil(Math.random() * 100)}, City ${Math.ceil(Math.random() * 50)}`,
  payement_method: ['Credit Card', 'Bank Transfer', 'Cash'][Math.floor(Math.random() * 3)],
  notes: `Notes for Client ${i + 1}`
}));
