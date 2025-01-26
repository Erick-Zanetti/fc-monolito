import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";
import { AddProductUseCaseInterface } from "../usecase/add-product/add-product.usecase.interface";
import { CheckStockUseCaseInterface } from "../usecase/check-stock/check-stock.usecase.interface";

export interface UseCasesProps {
  addUseCase: AddProductUseCaseInterface;
  checkStockUseCase: CheckStockUseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUsecase: AddProductUseCaseInterface;
  private _checkStockUsecase: CheckStockUseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._addUsecase = usecasesProps.addUseCase;
    this._checkStockUsecase = usecasesProps.checkStockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<boolean> {
    // caso o dto do caso de uso for != do dto da facade, converter o dto da facade para o dto do caso de uso
    await this._addUsecase.execute(input);
    return true;
  }
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUsecase.execute(input);
  }
}
