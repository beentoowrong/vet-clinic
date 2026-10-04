export const appointmentSelect = {
  id: true,
  appointmentCode: true,
  pet: { select: { id: true, name: true } },
  owner: {
    select: {
      id: true,
      user: { select: { id: true, name: true } },
    },
  },
  doctor: {
    select: {
      id: true,
      specialization: true,
      user: { select: { id: true, name: true } },
    },
  },
  serviceType: true,
  status: true,
  appointmentDate: true,
  appointmentTime: true,
  complaint: true,
  transportFee: true,
  invoices: {
    select: {
      id: true,
      invoiceNumber: true,
      type: true,
      totalAmount: true,
      status: true,
    },
  },
};