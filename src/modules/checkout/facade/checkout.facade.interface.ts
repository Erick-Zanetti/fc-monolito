
export interface CheckoutFacadeInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface CheckoutFacadeOutputDto {
    id: string;
    total: number;
    status: string;
    invoiceId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface CheckoutFacadeInterface {
    checkout(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto>;
}