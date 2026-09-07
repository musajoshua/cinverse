import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;
}
