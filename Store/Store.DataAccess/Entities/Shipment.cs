using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Shipment
{
    [Key, ForeignKey("Order")]
    public int OrderId { get; set; }
    public Order Order { get; set; }

    public string Address { get; set; }
    public string Status { get; set; }
    public DateTime? ShippedDate { get; set; }
}