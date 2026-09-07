import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  dateOfBirth: string;

  @Column('text', { array: true })
  filmography: string[];
}
