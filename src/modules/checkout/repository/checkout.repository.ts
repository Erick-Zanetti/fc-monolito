import Id from "src/modules/@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import OrderClientModel from "./client.model";
import OrderProductModel from "./product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create(
            {
                id: order.id.id,
                status: order.status,
                createdAt: new Date(),
                updatedAt: new Date(),
                client: {
                    orderId: order.id.id,
                    clientId: order.client.id.id,
                    name: order.client.name,
                    email: order.client.email,
                    address: order.client.address,
                },
                products: order.products.map((product) => ({
                    id: product.id.id,
                    orderId: order.id.id,
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                })),
            },
            { include: [OrderClientModel, OrderProductModel] }
        );
    }
    
    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findByPk(id, {
            include: [OrderClientModel, OrderProductModel],
        });
        
        if (!order) return null;
        
        return new Order({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.client.clientId),
                name: order.client.name,
                email: order.client.email,
                address: order.client.address,
            }),
            products: order.products.map(
                (product) =>
                    new Product({
                    id: new Id(product.id),
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                })
            ),
            status: order.status,
        });
    }
}
