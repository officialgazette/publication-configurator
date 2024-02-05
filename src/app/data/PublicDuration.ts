import { Expose } from "class-transformer";

export class PublicDuration {

  @Expose() default!: number;
  @Expose() min!: number;
  @Expose() max!: number;

}
