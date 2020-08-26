// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.EntityFrameworkCore;

namespace opteamate {

  public class OpteaMateContext : DbContext {
    public OpteaMateContext(DbContextOptions<OpteaMateContext> options)
        : base(options) {
    }

    public DbSet<EventDbo> Events { get; set; }
    public DbSet<RegistrationDbo> Registrations { get; set; }
    public DbSet<OptimumDbo> Optima { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
     => options.UseSqlite("Data Source=opteamate.db");

  }
}
