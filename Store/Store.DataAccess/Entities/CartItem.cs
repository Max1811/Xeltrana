﻿using Store.DataAccess.Entities;

public class CartItem
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int? ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; }
    public int Quantity { get; set; }
}