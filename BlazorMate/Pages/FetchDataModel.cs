using Microsoft.AspNetCore.Components;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace BlazorMate.Pages
{
  public partial class FetchDataModel : ComponentBase
  {
    private const string ServiceEndpoint = "http://localhost:4700/";
    public OptimaResponse optima;
    private string editRowStyle = "none";
    private string newItemName;

    protected override async Task OnInitializedAsync()
    {
      await GetItems();
    }

    private async Task GetItems()
    {
      var server = new HttpClient
      {
        BaseAddress = new Uri(ServiceEndpoint)
      };
      optima = await server.GetFromJsonAsync<OptimaResponse>(ServiceEndpoint + "api/optima");
    }

    public class OptimumData
    {
      public long OptimumDboId { get; set; }
      public string Name { get; set; }
      public string Strategies { get; set; }
      public string Positions { get; set; }
    }

    public class OptimumResponse
    {
      public OptimumData Data { get; set; }
    }

    public class OptimaResponse
    {
      public OptimumResponse[] Data { get; set; }
    }
  }
}
