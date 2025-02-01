import ClientAdmFacadeFactory from "src/modules/client-adm/factory/client-adm.facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import ProductAdmFacadeFactory from "src/modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "src/modules/store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "src/modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "src/modules/payment/factory/payment.facade.factory";
import CheckoutRepository from "../repository/checkout.repository";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const checkoutRepository = new CheckoutRepository();
        const checkoutUseCase = new PlaceOrderUseCase(clientFacade, productFacade, paymentFacade, catalogFacade, invoiceFacade, checkoutRepository);
        const checkoutFacade = new CheckoutFacade(checkoutUseCase);
        return checkoutFacade;
    }
}