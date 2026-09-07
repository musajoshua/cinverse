import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  dateOfBirth: Date;

  @Column('text', { array: true })
  filmography: string[];
}
