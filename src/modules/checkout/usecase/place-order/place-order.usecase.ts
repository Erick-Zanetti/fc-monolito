import Id from "src/modules/@shared/domain/value-object/id.value-object";
import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "src/modules/client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "src/modules/product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "src/modules/store-catalog/facade/store-catalog.facade.interface";
import InvoiceFacadeInterface from "src/modules/invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "src/modules/payment/facade/payment.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _repository: CheckoutGateway;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    repository: CheckoutGateway
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._paymentFacade = paymentFacade;
    this._catalogFacade = catalogFacade;
    this._invoiceFacade = invoiceFacade;
    this._repository = repository;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => {
        return this.getProduct(p.productId);
      })
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address.toString(),
    });

    const order = new Order({
      client: myClient,
      products: products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    let invoiceId = null;

    if (payment.status === "approved") {
      const invoice = await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: products.map((p) => {
          return {
            id: p.id.id,
            name: p.name,
            price: p.salesPrice,
          };
        }),
      });
      invoiceId = invoice.id;
      order.approved();
    }

    this._repository.addOrder(order);

    return {
      id: order.id.id,
      total: order.total,
      invoiceId: invoiceId,
      status: payment.status,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto) {
    if (!input.products || input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (!product) {
        throw new Error(`Product ${p.productId} not found`);
      }
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    const myProduct = new Product(productProps);
    return myProduct;
  }
}