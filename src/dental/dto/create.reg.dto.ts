import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRegisterDto {
    @ApiPropertyOptional({
      description: 'ID of register',
      example: 'fda03a90-4245-4fb3-b6fb-eb13e3201135',
    })
    regId?:string;
    
    @ApiProperty({
      description: 'Client name',
      example: 'John',
    })
    name: string;

    @ApiProperty({
        description: 'Client number',
        example: '+996555888999',
      })
    phone: string;
    
    @ApiProperty({
        description: 'Date and time of register',
        example: '2022-03-25T10:30:45.000Z',
      })
    startDate: Date;

    @ApiPropertyOptional({
        description: 'End time of register',
        example: '2022-03-25T11:30:45.000Z',
      })
    endDate?:Date;

    @ApiProperty({
        description: 'Doc ID',
        example: '1/2',
      })
    docId: number;

    @ApiPropertyOptional({
        description: 'Doc name',
        example: 'Axe',
    })
    docName?:string;

    @ApiPropertyOptional({
        description: 'Price',
        example: '100',
    })
    price?:number;
}