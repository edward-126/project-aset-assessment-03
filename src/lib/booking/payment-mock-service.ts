export class PaymentMockService {
  async processMockPayment() {
    return true;
  }
}

export const paymentMockService = new PaymentMockService();
