import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseConnectionService implements OnModuleInit {
  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      console.log('= Testing database connection...');
      console.log(`= Database: ${process.env.DB_DATABASE || 'hospital_booking'}`);
      console.log(`= Host: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`= Port: ${process.env.DB_PORT || 5432}`);
      console.log(`= User: ${process.env.DB_USERNAME || 'postgres'}`);

      await this.sequelize.authenticate();
      
      console.log('= Database connection established successfully!');
      console.log('= Sequelize is ready to use');
      
      const result = await this.sequelize.query('SELECT NOW() as current_time');
      console.log('= Database time:', result[0][0]);
      
    } catch (error) {
      console.error('Database connection failed!');
      console.error('Error details:', error.message);
      console.error('Full error:', error);
      
      if (error.name === 'SequelizeConnectionError') {
        console.error('   Connection Error - Check:');
        console.error('   • Database server is running');
        console.error('   • Host and port are correct');
        console.error('   • Network connectivity');
      }
      
      if (error.name === 'SequelizeAccessDeniedError') {
        console.error('   Access Denied - Check:');
        console.error('   • Username and password are correct');
        console.error('   • User has proper permissions');
        console.error('   • Database exists');
      }
      
      if (error.name === 'SequelizeDatabaseError') {
        console.error('   Database Error - Check:');
        console.error('   • Database name is correct');
        console.error('   • Database exists');
        console.error('   • User has access to database');
      }

      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      console.log('OK ---- Database connection test passed');
      return true;
    } catch (error) {
      console.error('FAILED ----- Database connection test failed:', error.message);
      return false;
    }
  }

  async getConnectionInfo(): Promise<any> {
    try {
      const config = this.sequelize.config;
      return {
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.username,
        dialect: 'postgres',
        status: 'connected'
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message
      };
    }
  }
}
