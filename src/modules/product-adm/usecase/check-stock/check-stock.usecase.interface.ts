import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import { CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "../../facade/product-adm.facade.interface";

export interface CheckStockUseCaseInterface extends UseCaseInterface {
  execute(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto>;
}
