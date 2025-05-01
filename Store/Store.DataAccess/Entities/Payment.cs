using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Payment
{
    [Key, ForeignKey("Order")]
    public int OrderId { get; set; }
    public Order Order { get; set; }

    public DateTime PaymentDate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; }
}