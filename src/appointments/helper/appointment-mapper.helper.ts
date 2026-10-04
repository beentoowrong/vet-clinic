export const formatAppointment = (a: any) => {
  return {
    ...a,
    complaint: a.complaint ?? '',
    transportFee: a.transportFee ? a.transportFee.toNumber() : null,
    appointmentDate:
      a.appointmentDate instanceof Date
        ? a.appointmentDate.toISOString().split('T')[0]
        : String(a.appointmentDate),
    invoices: a.invoices?.map((inv: any) => ({
      ...inv,
      totalAmount: inv.totalAmount.toNumber(),
    })),
  };
};