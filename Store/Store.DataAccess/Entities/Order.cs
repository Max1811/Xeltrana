﻿public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
    public Payment Payment { get; set; }
    public Shipment Shipment { get; set; }
}