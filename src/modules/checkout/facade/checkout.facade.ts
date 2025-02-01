import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { CheckoutFacadeInputDto, CheckoutFacadeOutputDto } from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {
    constructor(private checkoutUseCase: UseCaseInterface) {}

    async checkout(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
        return this.checkoutUseCase.execute(input);
    }
}